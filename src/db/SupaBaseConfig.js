import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; 
const supabaseKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side operations

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Check  .env file.');
}// the evn variables are only available in development mode


const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;