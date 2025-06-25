// supabase/functions/bill-new-term/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { url, headers } = req

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      auth: {
        // Use service_role key to bypass RLS for this backend operation
        // Only do this if the function is invoked by trusted sources (e.g., admin dashboard, scheduled job)
        // For public APIs, stick to anon key and configure RLS on tables carefully.
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )

  // Use the service_role key for direct database access from function (if needed to bypass RLS)
  // This key should be stored as a Supabase Secret, not hardcoded.
  // Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Assuming you've set this as a secret
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    })
  }

  let data
  try {
    data = await req.json()
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  const termId = data.term_id
  const billingDate = data.billing_date || new Date().toISOString().split('T')[0] // YYYY-MM-DD

  if (!termId) {
    return new Response(JSON.stringify({ error: 'term_id is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  try {
    // 1. Get term details and associated fees
    const { data: termFeesConfigs, error: termFeesError } = await supabaseAdmin
      .from('termfees')
      .select('grade, class, tuition_amount_usd, levy_amount_usd, tuition_amount_zwg, levy_amount_zwg')
      .eq('term_id', termId)

    if (termFeesError) throw termFeesError
    if (!termFeesConfigs || termFeesConfigs.length === 0) {
      return new Response(JSON.stringify({ error: `No fee configurations found for term ID ${termId}` }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    const feesMap = new Map()
    for (const config of termFeesConfigs) {
      const key = config.class ? `${config.grade}-${config.class}` : `${config.grade}-null`
      feesMap.set(key, config)
    }

    // 2. Get all active students
    const { data: Students, error: studentsError } = await supabaseAdmin
      .from('Students')
      .select('id, Grade, Class, Tuition_Owing, Levy_Owing, ContactInfo') // Assuming ContactInfo contains parent email/phone
      .eq('Status', 'active')

    if (studentsError) throw studentsError

    const newFeeRecords = []
    const updatedStudentBalances = []
    const messagesToSend = []

    for (const student of Students) {
      const studentId = student.id
      const grade = student.Grade
      const _class = student.Class
      const currentTuitionOwing = student.Tuition_Owing || 0
      const currentLevyOwing = student.Levy_Owing || 0
      const contactInfo = student.ContactInfo // Use this for messaging

      let applicableFees = feesMap.get(`${grade}-${_class}`)
      if (!applicableFees) {
        // Fallback to grade-only if class-specific fees not found
        applicableFees = feesMap.get(`${grade}-null`)
      }

      if (!applicableFees) {
        console.warn(`Warning: No fee config found for student ${studentId} (Grade: ${grade}, Class: ${_class}). Skipping.`)
        continue
      }

      const newTuitionChargeUsd = applicableFees.tuition_amount_usd
      const newLevyChargeUsd = applicableFees.levy_amount_usd
      const newTuitionChargeZwg = applicableFees.tuition_amount_zwg
      const newLevyChargeZwg = applicableFees.levy_amount_zwg

      const updatedTuitionOwing = currentTuitionOwing + newTuitionChargeUsd
      const updatedLevyOwing = currentLevyOwing + newLevyChargeUsd

      updatedStudentBalances.push({
        id: studentId,
        Tuition_Owing: updatedTuitionOwing,
        Levy_Owing: updatedLevyOwing,
      })

      // Prepare new Fee records for USD and ZWG
      if (newTuitionChargeUsd > 0) {
        newFeeRecords.push({
          StudentID: studentId,
          Date: billingDate,
          Amount: newTuitionChargeUsd,
          Type: 'tuition',
          Currency: 'usd',
          USD_equivalent: newTuitionChargeUsd,
          Timeline: 'normal', // Default as per your schema
          Form: 'cash_bill' // Indicate it's a system-generated bill
        })
      }
      if (newTuitionChargeZwg > 0) {
        newFeeRecords.push({
          StudentID: studentId,
          Date: billingDate,
          Amount: newTuitionChargeZwg,
          Type: 'tuition',
          Currency: 'zwg',
          USD_equivalent: newTuitionChargeUsd, // Assuming USD_equivalent from USD charge
          Timeline: 'normal',
          Form: 'cash_bill'
        })
      }
      if (newLevyChargeUsd > 0) {
        newFeeRecords.push({
          StudentID: studentId,
          Date: billingDate,
          Amount: newLevyChargeUsd,
          Type: 'levy',
          Currency: 'usd',
          USD_equivalent: newLevyChargeUsd,
          Timeline: 'normal',
          Form: 'cash_bill'
        })
      }
      if (newLevyChargeZwg > 0) {
        newFeeRecords.push({
          StudentID: studentId,
          Date: billingDate,
          Amount: newLevyChargeZwg,
          Type: 'levy',
          Currency: 'zwg',
          USD_equivalent: newLevyChargeUsd, // Assuming USD_equivalent from USD charge
          Timeline: 'normal',
          Form: 'cash_bill'
        })
      }

      // Prepare message content (you'd customize this)
      if (contactInfo) {
        messagesToSend.push({
          recipient: contactInfo,
          message: `Dear Parent, your child ${student.FirstNames} ${student.Surname} has been billed for the new term. Total due: USD ${updatedTuitionOwing + updatedLevyOwing}.`
          // You can expand this to include detailed breakdown
        });
      }
    }

    // Use a transaction for atomicity (all or nothing)
    const { error: transactionError } = await supabaseAdmin.rpc('perform_billing_transaction', {
      student_updates: updatedStudentBalances,
      fee_inserts: newFeeRecords
    })

    if (transactionError) throw transactionError;

    // 5. (Optional) Send messages to parents
    // This part requires integration with external APIs (Twilio, SendGrid)
    // You would call another function or an external service here
    console.log("Messages prepared for sending:", messagesToSend);
    // For actual sending, you'd have to make HTTP requests to Twilio/SendGrid APIs
    // using their respective Deno/JS libraries or raw fetch requests.
    // Ensure API keys are stored as Supabase Secrets (e.g., Deno.env.get('TWILIO_ACCOUNT_SID'))

    return new Response(JSON.stringify({ message: `Successfully billed ${Students.length} active students for term ${termId}` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error during billing:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})