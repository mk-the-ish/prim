import supabase from '../../db/SupaBaseConfig.js';
// Fetching transactions for CBZ and ZB banks

export const fetchCBZTransactions = async (year) => {
    const [inUsd, inZwg, outUsd, outZwg] = await Promise.all([
        supabase
            .from('IncomingBankTransactions')
            .select('Amount')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
            .eq('Bank', 'cbz')
            .eq('Currency', 'usd'),
        supabase
            .from('IncomingBankTransactions')
            .select('Amount, USD_equivalent')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
            .eq('Bank', 'cbz')
            .eq('Currency', 'zwg'),
        supabase
            .from('OutgoingBankTransactions')
            .select('Amount')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
            .eq('Bank', 'cbz')
            .eq('Currency', 'usd'),
        supabase
            .from('OutgoingBankTransactions')
            .select('Amount, USD_equivalent')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
            .eq('Bank', 'cbz')
            .eq('Currency', 'zwg')
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
            .from('IncomingBankTransactions')
            .select('Amount')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
            .eq('Bank', 'zb')
            .eq('Currency', 'usd'),
        supabase
            .from('IncomingBankTransactions')
            .select('Amount, USD_equivalent')        
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
            .eq('Bank', 'zb')
            .eq('Currency', 'zwg'),
        supabase
            .from('OutgoingBankTransactions')
            .select('Amount')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
            .eq('Bank', 'zb')
            .eq('Currency', 'usd'),
        supabase
            .from('OutgoingBankTransactions')
            .select('Amount, USD_equivalent')
            .gte('Date', `${year}-01-01`)
            .lte('Date', `${year}-12-31`)
            .eq('Bank', 'zb')
            .eq('Currency', 'zwg')
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

export const fetchCashFlowData = async (year) => {
    try {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        // Fetch both incoming and outgoing transactions
        const [incomingTxns, outgoingTxns] = await Promise.all([
            supabase
                .from('IncomingBankTransactions')
                .select('Amount, Date, Category, Currency')
                .gte('Date', startDate)
                .lte('Date', endDate),
            supabase
                .from('OutgoingBankTransactions')
                .select('Amount, Date, Category, Currency')
                .gte('Date', startDate)
                .lte('Date', endDate)
        ]);

        // Initialize monthly arrays
        const months = Array(12).fill(0);
        const levyInData = [...months];
        const levyOutData = [...months];
        const tuitionInData = [...months];
        const tuitionOutData = [...months];

        // Aggregate incoming transactions
        incomingTxns.data?.forEach(tx => {
            const month = new Date(tx.Date).getMonth();
            // Normalize category and currency for case-insensitive comparison
            const category = (tx.Category || '').toLowerCase();
            const currency = (tx.Currency || '').toLowerCase();
            if (category === 'levy' && currency === 'usd') {
            levyInData[month] += Number(tx.Amount) || 0;
            } else if (category === 'tuition' && currency === 'usd') {
            tuitionInData[month] += Number(tx.Amount) || 0;
            }
        });

        // Aggregate outgoing transactions
        outgoingTxns.data?.forEach(tx => {
            const month = new Date(tx.Date).getMonth();
            if (tx.Category === 'levy' && tx.Currency === 'USD') {
                levyOutData[month] += Number(tx.Amount) || 0;
            } else if (tx.Category === 'tuition' && tx.Currency === 'USD') {
                tuitionOutData[month] += Number(tx.Amount) || 0;
            }
        });

        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return {
            levyCashFlow: {
                labels: monthLabels,
                datasets: [
                    {
                        label: 'Levy IN',
                        data: levyInData,
                        backgroundColor: '#36A2EB'
                    },
                    {
                        label: 'Levy OUT',
                        data: levyOutData,
                        backgroundColor: '#FF6384'
                    }
                ]
            },
            tuitionCashFlow: {
                labels: monthLabels,
                datasets: [
                    {
                        label: 'Tuition IN',
                        data: tuitionInData,
                        backgroundColor: '#4BC0C0'
                    },
                    {
                        label: 'Tuition OUT',
                        data: tuitionOutData,
                        backgroundColor: '#FFCE56'
                    }
                ]
            }
        };
    } catch (error) {
        console.error('Error fetching cash flow data:', error);
        // Return default structure on error
        return {
            levyCashFlow: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    { label: 'Levy IN', data: Array(12).fill(0), backgroundColor: '#36A2EB' },
                    { label: 'Levy OUT', data: Array(12).fill(0), backgroundColor: '#FF6384' }
                ]
            },
            tuitionCashFlow: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    { label: 'Tuition IN', data: Array(12).fill(0), backgroundColor: '#4BC0C0' },
                    { label: 'Tuition OUT', data: Array(12).fill(0), backgroundColor: '#FFCE56' }
                ]
            }
        };
    }
};

export const fetchDashboardStats = async () => {
    try {
        // Fetch total students
        const { data: totalStudents, error: studentsError } = await supabase
            .from('Students')
            .select('id')
            .eq('Status', 'active');

        if (studentsError) throw studentsError;

        // Fetch students owing
        const { data: studentsOwing, error: owingError } = await supabase
            .from('Students')
            .select('id')
            .or('Tuition_Owing.gt.0,Levy_Owing.gt.0')
            .eq('Status', 'active');

        if (owingError) throw owingError;

        // Calculate revenues from new transaction tables
        const [incomingTxns, outgoingTxns] = await Promise.all([
            supabase.from('IncomingBankTransactions').select('Amount, Category, Currency'),
            supabase.from('OutgoingBankTransactions').select('Amount, Category, Currency')
        ]);

        const revenues = {
            cbz: { usd: 0, zwg: 0 },
            zb: { usd: 0, zwg: 0 }
        };

        // Calculate revenues for each bank and currency
        incomingTxns.data?.forEach(tx => {
            if (tx.Bank === 'CBZ') {
                revenues.cbz[tx.Currency.toLowerCase()] += Number(tx.Amount) || 0;
            } else if (tx.Bank === 'ZB') {
                revenues.zb[tx.Currency.toLowerCase()] += Number(tx.Amount) || 0;
            }
        });

        outgoingTxns.data?.forEach(tx => {
            if (tx.Bank === 'CBZ') {
                revenues.cbz[tx.Currency.toLowerCase()] -= Number(tx.Amount) || 0;
            } else if (tx.Bank === 'ZB') {
                revenues.zb[tx.Currency.toLowerCase()] -= Number(tx.Amount) || 0;
            }
        });

        return {
            totalStudents: totalStudents.length,
            studentsOwing: studentsOwing.length,
            cbzRevenueUsd: revenues.cbz.usd,
            cbzRevenueZwg: revenues.cbz.zwg,
            zbRevenueUsd: revenues.zb.usd,
            zbRevenueZwg: revenues.zb.zwg
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw new Error('Failed to fetch dashboard statistics');
    }
};

export const fetchStudentChartData = async () => {
    try {
        const { data: students, error } = await supabase
            .from('Students')
            .select('Gender, Grade')
            .eq('Status', 'active');

        if (error) throw error;

        // Process gender data
        const genderCounts = students.reduce((acc, student) => {
            acc[student.Gender] = (acc[student.Gender] || 0) + 1;
            return acc;
        }, {});

        // Process grade data
        const gradeCounts = students.reduce((acc, student) => {
            acc[student.Grade] = (acc[student.Grade] || 0) + 1;
            return acc;
        }, {});

        return {
            genderData: {
                labels: ['Male', 'Female'],
                datasets: [{
                    data: [genderCounts['Male'] || 0, genderCounts['Female'] || 0],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                    hoverBackgroundColor: ['#36A2EB80', '#FF638480']
                }]
            },
            gradeData: {
                labels: Object.keys(gradeCounts).sort(),
                datasets: [{
                    data: Object.values(gradeCounts),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    hoverBackgroundColor: ['#FF638480', '#36A2EB80', '#FFCE5680', '#4BC0C080', '#9966FF80', '#FF9F4080']
                }]
            }
        };
    } catch (error) {
        console.error('Error fetching student chart data:', error);
        throw new Error('Failed to fetch student statistics');
    }
};

// Helper functions
const fetchAccountRevenue = async (account, currency) => {
    try {
        const [inTransactions, outTransactions] = await Promise.all([
            fetchTransactionTotal(`${account}_in_txn_${currency}`),
            fetchTransactionTotal(`${account}_out_txn_${currency}`)
        ]);
        return inTransactions - outTransactions;
    } catch (error) {
        console.error(`Error fetching ${account} ${currency} revenue:`, error);
        return 0;
    }
};

const fetchTransactionTotal = async (table, filters) => {
    const { data, error } = await supabase
        .from(table)
        .select('Amount')
        .match(filters);
    
    if (error) throw error;
    return data.reduce((sum, tx) => sum + (Number(tx.Amount) || 0), 0);
};

const fetchTransactionsData = async (tables, startDate, endDate) => {
    const result = { levy: [], tuition: [] };
    
    for (const [type, tableList] of Object.entries(tables)) {
        const promises = tableList.map(table => 
            supabase
                .from(table)
                .select('Amount, Date')
                .gte('Date', startDate)
                .lte('Date', endDate)
        );
        
        const responses = await Promise.all(promises);
        result[type] = responses.map(r => r.data || []);
    }
    
    return result;
};

const formatCashFlowData = (data, inColor, outColor) => {
    const months = Array(12).fill(0);
    const inData = [...months];
    const outData = [...months];

    // Process in and out transactions
    data.forEach((transactions, index) => {
        transactions.forEach(tx => {
            const month = new Date(tx.Date).getMonth();
            if (index < 2) { // First two arrays are for USD
                if (index % 2 === 0) inData[month] += tx.Amount;
                else outData[month] += tx.Amount;
            }
        });
    });

    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            { label: 'IN', data: inData, backgroundColor: inColor },
            { label: 'OUT', data: outData, backgroundColor: outColor }
        ]
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