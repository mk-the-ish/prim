import { supabase } from '../../db/SupaBaseConfig';

export const fetchLevyUSD = async () => {
    const { data, error } = await supabase
        .from('levy_usd')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};

export const fetchLevyZWG = async () => {
    const { data, error } = await supabase
        .from('levy_zwg')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};

export const fetchTuitionUSD = async () => {
    const { data, error } = await supabase
        .from('tuition_usd')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};

export const fetchTuitionZWG = async () => {
    const { data, error } = await supabase
        .from('tuition_zwg')
        .select('*, Students(FirstNames, Surname, Grade, Class, Gender)')
        .order('Date', { ascending: false });

    if (error) throw error;
    return data;
};

export const fetchCommissionsIn = async () => {
    const { data, error } = await supabase
        .from('commissions_in')
        .select('id, Date, From, Amount, Description')
        .order('Date', { ascending: false });

    if (error) throw error
    return data;
};

export const fetchCommissionsOut = async () => {
    const { data, error } = await supabase
        .from('commissions_out')
        .select('id, Date, From, Amount, Description')
        .order('Date', { ascending: false });

    if (error) throw error
    return data;
};

export const fetchPayments = async (studentId) => {
    const [levyUsd, levyZwg, tuitionUsd, tuitionZwg] = await Promise.all([
        supabase.from('levy_in_txn_usd').select('*').eq('student_id', studentId),
        supabase.from('levy_in_txn_zwg').select('*').eq('student_id', studentId),
        supabase.from('tuition_in_txn_usd').select('*').eq('student_id', studentId),
        supabase.from('tuition_in_txn_zwg').select('*').eq('student_id', studentId),
    ]);

    return {
        levyUsd: levyUsd.data || [],
        levyZwg: levyZwg.data || [],
        tuitionUsd: tuitionUsd.data || [],
        tuitionZwg: tuitionZwg.data || [],
    };
};