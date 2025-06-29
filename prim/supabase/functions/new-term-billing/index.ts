import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info"
};

Deno.serve(async (req) => {
  console.log("Request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));

  if (req.method === "OPTIONS") {
    console.log("OPTIONS preflight received. Responding with CORS headers.");
    const response = new Response(null, { status: 200, headers: corsHeaders });
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    return response;
  }

  // @ts-ignore
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  // @ts-ignore
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const client = createClient(supabaseUrl, supabaseKey);

  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error("JSON parse error:", err);
    const response = new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    return response;
  }
  const { term_id } = body;
  if (!term_id) {
    const response = new Response(
      JSON.stringify({ error: "term_id is required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    return response;
  }

  // 1. Fetch the term
  const { data: term, error: termError } = await client
    .from("Terms")
    .select("levy_billed, tuition_billed")
    .eq("id", term_id)
    .single();
  if (termError || !term) {
    console.error("Term fetch error:", termError);
    const response = new Response(
      JSON.stringify({ error: termError?.message || "Term not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    return response;
  }

  // 2. Fetch all students
  const { data: students, error: studentsError } = await client
    .from("Students")
    .select("id, Levy_Owing, Tuition_Owing");
  if (studentsError) {
    console.error("Students fetch error:", studentsError);
    const response = new Response(
      JSON.stringify({ error: studentsError.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    return response;
  }

  // 3. Bill each student
  let updateErrors: { id: any; error: any }[] = [];
  for (const student of students) {
    const newLevy = Number(student.Levy_Owing || 0) + Number(term.levy_billed || 0);
    const newTuition = Number(student.Tuition_Owing || 0) + Number(term.tuition_billed || 0);
    const { error: updateError } = await client
      .from("Students")
      .update({ Levy_Owing: newLevy, Tuition_Owing: newTuition })
      .eq("id", student.id);
    if (updateError) {
      updateErrors.push({ id: student.id, error: updateError.message });
      console.error(`Update error for student ${student.id}:`, updateError.message);
    }
  }

  if (updateErrors.length > 0) {
    const response = new Response(
      JSON.stringify({ error: "Some students failed to update", details: updateErrors }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    return response;
  }

  const response = new Response(
    JSON.stringify({ message: "New term billed successfully!" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
  console.log("Response status:", response.status);
  console.log("Response headers:", Object.fromEntries(response.headers.entries()));
  return response;
});
