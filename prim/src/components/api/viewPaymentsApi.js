import supabase from '../../db/SupaBaseConfig';

export const fetchLevyUSD = async () => {
    const { data, error } = await supabase
        .from('Fees')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};

export const fetchLevyZWG = async () => {
    const { data, error } = await supabase
        .from('Fees')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};

export const fetchTuitionUSD = async () => {
    const { data, error } = await supabase
        .from('Fees')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};

export const fetchTuitionZWG = async () => {
    const { data, error } = await supabase
        .from('Fees')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};

export const fetchCommissionsIn = async () => {
    const { data, error } = await supabase
        .from('Commissions')
        .select('id, Date, Payee, Amount, Description')
        .order('Date', { ascending: false });

    if (error) throw error
    return data;
};

export const fetchCommissionsOut = async () => {
    const { data, error } = await supabase
        .from('Commissions')
        .select('id, Date, Payee, Amount, Description')
        .order('Date', { ascending: false });

    if (error) throw error
    return data;
};