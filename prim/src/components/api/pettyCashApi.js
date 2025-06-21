import supabase from '../../db/SupaBaseConfig';

export const fetchPettyCashTransactions = async () => {
    const { data, error } = await supabase
        .from('pettyCash')
        .select('*');
    if (error) throw error;
    return data;
};

export const fetchCBZPettyCashTransactions = async () => {
    const { data, error } = await supabase
        .from('OutgoingBankTransactions')
        .select('*')
        .eq('To', 'petty cash');
    if (error) throw error;
    return data;
};
