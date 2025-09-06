// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Hello from Functions!");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get env vars
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Create the client
  const client = createClient(supabaseUrl, supabaseKey);

  // 1. Set Grade 7 students to graduated
  const { error: gradError } = await client
    .from("Students")
    .update({ Status: "graduated" })
    .eq("Grade", "7");
  if (gradError) {
    console.log("Grade 7 update error:", gradError.message);
    return new Response(JSON.stringify({ error: gradError.message }), { status: 500, headers: corsHeaders });
  }

  // 2. Grade promotion mapping
  const gradeOrder = [
    ["6", "7"],
    ["5", "6"],
    ["4", "5"],
    ["3", "4"],
    ["2", "3"],
    ["1", "2"],
    ["ECD B", "1"],
    ["ECD A", "ECD B"]
  ];

  // 3. Promote students (except Grade 7)
  for (const [from, to] of gradeOrder) {
    const { error } = await client
      .from("Students")
      .update({ Grade: to })
      .eq("Grade", from);
    if (error) {
      console.log(`Promotion error for ${from} -> ${to}:`, error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
  }

  // 4. Delete all class teacher assignments
  const { error: delError } = await client
    .from("classteachers")
    .delete()
    .gt("id", 0); // delete all
  if (delError) {
    console.log("Class teacher delete error:", delError.message);
    return new Response(JSON.stringify({ error: delError.message }), { status: 500, headers: corsHeaders });
  }

  return new Response(
    JSON.stringify({ message: "Academic year upgraded successfully!" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/new-academic-year' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
