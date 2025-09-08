import supabase from '../../db/SupaBaseConfig';

// Fetch Fees with joined Students and Accounts info
export const fetchFees = async () => {
    const { data, error } = await supabase
        .from('Fees')
        .select('*, Students(firstNames, surname, grade, class, gender), Accounts(bank, branch, accNumber, currency)')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

// Fetch commissions from Cash table where type = 'commission'
export const fetchCommissions = async () => {
    const { data, error } = await supabase
        .from('Cash')
        .select('id, created_at, date, amount, description, flow, type, category, recipient')
        .eq('type', 'commission')
        .order('date', { ascending: false });
    if (error) throw error;
    return data;
};

// Add commission to Cash table with type = 'commission'
export const addCommission = async (commission) => {
    const payload = {
        ...commission,
        type: 'commission'
    };
    const { error } = await supabase
        .from('Cash')
        .insert([payload]);
    if (error) throw error;
};

// Fetch petty cash transactions (Money Out)
export const fetchCashTransactions = async () => {
    const { data, error } = await supabase
        .from('Cash')
        .select('id, created_at, date, amount, description, flow, type, category, recipient')
        .eq('flow', 'out')
        .order('date', { ascending: false });
    if (error) return [];
    return data || [];
};

// Fetch bank transactions (Money In)
export const fetchBankTransactions = async () => {
    const { data, error } = await supabase
        .from('Bank')
        .select('*')
        .eq('flow', 'in')
        .order('date', { ascending: false });
    if (error) return [];
    return data || [];
};

// Add petty cash transaction
export const addCashTransaction = async (payload) => {
    const { error } = await supabase
        .from('Cash')
        .insert([payload]);
    if (error) throw error;
};

// Add bank transaction
export const addBankTransaction = async (payload) => {
    const { error } = await supabase
        .from('Bank')
        .insert([payload]);
    if (error) throw error;
};

// Fetch account options for dropdown
export const fetchAccountOptions = async () => {
    const { data, error } = await supabase
        .from('Accounts')
        .select('id, bank, branch, accNumber, currency');
    if (error) return [];
    return data || [];
};
