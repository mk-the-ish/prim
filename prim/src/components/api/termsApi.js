import supabase from '../../db/SupaBaseConfig';

// Add a new term to the terms table
export async function addTerm({ start_date, end_date, levy_billed, tuition_billed }) {
  const { data, error } = await supabase
    .from('terms')
    .insert([
      {
        start_date,
        end_date,
        levy_billed: Number(levy_billed),
        tuition_billed: Number(tuition_billed),
      },
    ])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Fetch all terms (for date overlap validation)
export async function fetchTerms() {
  const { data, error } = await supabase
    .from('terms')
    .select('*');
  if (error) throw new Error(error.message);
  return data;
}
