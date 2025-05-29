import supabase from '../../db/SupaBaseConfig.js';
// Fetching transactions for CBZ and ZB banks

export const fetchCBZTransactions = async (year) => {
    const [inUsd, inZwg, outUsd, outZwg] = await Promise.all([
        supabase
            .from('levy_in_txn_usd')
            .select('Amount')
            .eq('bank', 'CBZ')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`),
        supabase
            .from('levy_in_txn_zwg')
            .select('Amount, USD_equivalent')
            .eq('bank', 'CBZ')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`),
        supabase
            .from('levy_out_txn_usd')
            .select('Amount')
            .eq('bank', 'CBZ')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`),
        supabase
            .from('levy_out_txn_zwg')
            .select('Amount, USD_equivalent')
            .eq('bank', 'CBZ')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
    ]);

    const sumAmounts = (transactions) =>
        transactions?.data?.reduce((sum, txn) => sum + (Number(txn.Amount) || 0), 0) || 0;

    const sumUsdEquivalent = (transactions) =>
        transactions?.data?.reduce((sum, txn) => sum + (Number(txn.USD_equivalent) || 0), 0) || 0;

    const totalInUsd = sumAmounts(inUsd);
    const totalOutUsd = sumAmounts(outUsd);
    const totalInZwg = sumAmounts(inZwg);
    const totalOutZwg = sumAmounts(outZwg);
    const totalInZwgUsdEquiv = sumUsdEquivalent(inZwg);
    const totalOutZwgUsdEquiv = sumUsdEquivalent(outZwg);

    return {
        cbzRevenueUsd: totalInUsd - totalOutUsd,
        cbzRevenueZwg: totalInZwg - totalOutZwg,
        cbzRevenueZwgUsdEquiv: totalInZwgUsdEquiv - totalOutZwgUsdEquiv
    };
};

export const fetchZBTransactions = async (year) => {
    const [inUsd, inZwg, outUsd, outZwg] = await Promise.all([
        supabase
            .from('levy_in_txn_usd')
            .select('Amount')
            .eq('bank', 'ZB')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`),
        supabase
            .from('levy_in_txn_zwg')
            .select('Amount, USD_equivalent')
            .eq('bank', 'ZB')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`),
        supabase
            .from('levy_out_txn_usd')
            .select('Amount')
            .eq('bank', 'ZB')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`),
        supabase
            .from('levy_out_txn_zwg')
            .select('Amount, USD_equivalent')
            .eq('bank', 'ZB')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
    ]);

    const sumAmounts = (transactions) =>
        transactions?.data?.reduce((sum, txn) => sum + (Number(txn.Amount) || 0), 0) || 0;

    const sumUsdEquivalent = (transactions) =>
        transactions?.data?.reduce((sum, txn) => sum + (Number(txn.USD_equivalent) || 0), 0) || 0;

    const totalInUsd = sumAmounts(inUsd);
    const totalOutUsd = sumAmounts(outUsd);
    const totalInZwg = sumAmounts(inZwg);
    const totalOutZwg = sumAmounts(outZwg);
    const totalInZwgUsdEquiv = sumUsdEquivalent(inZwg);
    const totalOutZwgUsdEquiv = sumUsdEquivalent(outZwg);

    return {
        zbRevenueUsd: totalInUsd - totalOutUsd,
        zbRevenueZwg: totalInZwg - totalOutZwg,
        zbRevenueZwgUsdEquiv: totalInZwgUsdEquiv - totalOutZwgUsdEquiv
    };
};

export const fetchDashboardStats = async () => {
    const year = new Date().getFullYear();
    const [
        studentsCount,
        studentsOwingCount,
        cbzTransactions,
        zbTransactions
    ] = await Promise.all([
        supabase.from('Students').select('*', { count: 'exact' }),
        supabase
            .from('Students')
            .select('*', { count: 'exact' })
            .or('Levy_Owing.gt.0,Tuition_Owing.gt.0')
            .eq('Sponsor', 'self'),
        fetchCBZTransactions(year),
        fetchZBTransactions(year)
    ]);

    return {
        totalStudents: studentsCount.count,
        studentsOwing: studentsOwingCount.count,
        ...cbzTransactions,
        ...zbTransactions
    };
};

export const fetchStudentChartData = async () => {
    const { data: students, error } = await supabase
        .from('Students')
        .select('Gender, Grade');

    if (error) throw error;

    const genderCounts = { Male: 0, Female: 0 };
    const gradeCounts = {};

    students?.forEach(student => {
        if (student.Gender) genderCounts[student.Gender]++;
        if (student.Grade) {
            gradeCounts[student.Grade] = (gradeCounts[student.Grade] || 0) + 1;
        }
    });

    return {
        genderData: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [genderCounts.Male, genderCounts.Female],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB80', '#FF638480']
            }]
        },
        gradeData: {
            labels: Object.keys(gradeCounts).sort(),
            datasets: [{
                data: Object.values(gradeCounts),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#4BC0C0'
                ],
                hoverBackgroundColor: [
                    '#FF638480', '#36A2EB80', '#FFCE5680', '#4BC0C080',
                    '#9966FF80', '#FF9F4080', '#FF638480', '#4BC0C080'
                ]
            }]
        }
    };
};

export const fetchCashFlowData = async (year) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [levyInData, levyOutData, tuitionInData, tuitionOutData] = await Promise.all([
        supabase.from('levy_in_txn_usd').select('Amount, Date').gte('Date', `${year}-01-01`).lte('Date', `${year}-12-31`),
        supabase.from('levy_out_txn_usd').select('Amount, Date').gte('Date', `${year}-01-01`).lte('Date', `${year}-12-31`),
        supabase.from('tuition_in_txn_usd').select('Amount, Date').gte('Date', `${year}-01-01`).lte('Date', `${year}-12-31`),
        supabase.from('tuition_out_txn_usd').select('Amount, Date').gte('Date', `${year}-01-01`).lte('Date', `${year}-12-31`)
    ]);

    const processTransactions = (transactions) => {
        const amounts = Array(12).fill(0);
        transactions?.data?.forEach(txn => {
            const month = new Date(txn.Date).getMonth();
            amounts[month] += Number(txn.Amount) || 0;
        });
        return amounts;
    };

    return {
        levyCashFlow: {
            labels: months,
            datasets: [
                { label: 'Levy IN', data: processTransactions(levyInData), backgroundColor: '#36A2EB' },
                { label: 'Levy OUT', data: processTransactions(levyOutData), backgroundColor: '#FF6384' }
            ]
        },
        tuitionCashFlow: {
            labels: months,
            datasets: [
                { label: 'Tuition IN', data: processTransactions(tuitionInData), backgroundColor: '#4BC0C0' },
                { label: 'Tuition OUT', data: processTransactions(tuitionOutData), backgroundColor: '#FFCE56' }
            ]
        }
    };
};

export const fetchStudentsForInvoicing = async ({ gradeFilter, classFilter, page, pageSize }) => {
    let query = supabase
        .from('Students')
        .select('id, FirstNames, Surname, Grade, Class, Levy_Owing, Tuition_Owing', { count: 'exact' })
        .order('id', { ascending: true })
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (gradeFilter) query = query.eq('Grade', gradeFilter);
    if (classFilter) query = query.eq('Class', classFilter);

    const { data: students, error, count } = await query;

    if (error) throw error;

    return {
        students,
        totalPages: Math.ceil(count / pageSize)
    };
};