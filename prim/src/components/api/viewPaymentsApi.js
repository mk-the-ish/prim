import supabase from '../../db/SupaBaseConfig';

export const fetchFees = async () => {
    const { data, error } = await supabase
        .from('Fees')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};


export const fetchCommissions = async () => {
    const { data, error } = await supabase
        .from('Commissions')
        .select('id, Date, Payee, Amount, Description')
        .order('Date', { ascending: false });

    if (error) throw error
    return data;
};
