// supabase/functions/new-academic-year/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Ensure only POST requests are allowed for this sensitive operation
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    })
  }

  // Initialize Supabase client with the service_role key for administrative access
  // The SUPABASE_SERVICE_ROLE_KEY must be set as a Supabase Secret in your project dashboard
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )

  try {
    // Call the PostgreSQL function using RPC (Remote Procedure Call)
    const { data, error } = await supabaseAdmin.rpc('upgrade_academic_year')

    if (error) {
      console.error('Error calling PostgreSQL function:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Return the message from the PostgreSQL function
    return new Response(JSON.stringify({ message: data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Unhandled error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})