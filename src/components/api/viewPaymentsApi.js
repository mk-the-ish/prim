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

// Fetch incoming CBZ transactions for a given date
export const fetchCBZIncoming = async (startDate, endDate) => {
    const { data, error } = await supabase
        .from('IncomingBankTransactions')
        .select('*')
        .eq('Bank', 'cbz')
        .gte('Date', startDate)
        .lte('Date', endDate);
    if (error) throw error;
    return data;
};

// Fetch outgoing CBZ transactions for a given date
export const fetchCBZOutgoing = async (startDate, endDate) => {
    const { data, error } = await supabase
        .from('OutgoingBankTransactions')
        .select('*')
        .eq('Bank', 'cbz')
        .gte('Date', startDate)
        .lte('Date', endDate);
    if (error) throw error;
    return data;
};

// Fetch incoming ZB transactions for a given date
export const fetchZBIncoming = async (startDate, endDate) => {
    const { data, error } = await supabase
        .from('IncomingBankTransactions')
        .select('*')
        .eq('Bank', 'zb')
        .gte('Date', startDate)
        .lte('Date', endDate);
    if (error) throw error;
    return data;
};

// Fetch outgoing ZB transactions for a given date
export const fetchZBOutgoing = async (startDate, endDate) => {
    const { data, error } = await supabase
        .from('OutgoingBankTransactions')
        .select('*')
        .eq('Bank', 'zb')
        .gte('Date', startDate)
        .lte('Date', endDate);
    if (error) throw error;
    return data;
};

export const addCommission = async (commission) => {
    const { data, error } = await supabase
        .from('Commissions')
        .insert([{ ...commission }]);
    if (error) throw error;
    return data;
};
