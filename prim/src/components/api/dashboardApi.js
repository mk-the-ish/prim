import supabase from '../../db/SupaBaseConfig';

// Fetch monthly cash flow for levy and tuition (IN/OUT) for a given year
export const fetchCashFlowData = async (year) => {
  // Helper to get monthly sums
  const getMonthlySums = async (table, type) => {
    const { data, error } = await supabase
      .from(table)
      .select('Amount, Date')
      .eq('Type', type)
      .gte('Date', `${year}-01-01`)
      .lte('Date', `${year}-12-31`);
    if (error) throw error;
    // Aggregate by month
    const monthly = Array(12).fill(0);
    data.forEach(txn => {
      const month = new Date(txn.Date).getMonth();
      monthly[month] += Number(txn.Amount) || 0;
    });
    return monthly;
  };

  // Fetch all in parallel
  const [levyIn, levyOut, tuitionIn, tuitionOut] = await Promise.all([
    getMonthlySums('LevyTransactions', 'IN'),
    getMonthlySums('LevyTransactions', 'OUT'),
    getMonthlySums('TuitionTransactions', 'IN'),
    getMonthlySums('TuitionTransactions', 'OUT'),
  ]);

  return {
    levyCashFlow: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        { label: 'Levy IN', data: levyIn, backgroundColor: '#36A2EB' },
        { label: 'Levy OUT', data: levyOut, backgroundColor: '#FF6384' }
      ]
    },
    tuitionCashFlow: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        { label: 'Tuition IN', data: tuitionIn, backgroundColor: '#4BC0C0' },
        { label: 'Tuition OUT', data: tuitionOut, backgroundColor: '#FFCE56' }
      ]
    }
  };
};

// Fetch recent transactions (last 10, most recent first)
export const fetchRecentTransactions = async () => {
  const { data, error } = await supabase
    .from('Transactions')
    .select('*')
    .order('Date', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
};

// Fetch dashboard statistics for admin
export const fetchDashboardStats = async () => {
  // Total students
  const { data: students, error: studentsError } = await supabase
    .from('Students')
    .select('id, Levy_Owing, Tuition_Owing');
  if (studentsError) throw studentsError;
  const totalStudents = students.length;
  const studentsOwing = students.filter(s => (s.Levy_Owing > 0 || s.Tuition_Owing > 0)).length;

  // CBZ Net Revenue (USD, ZWG)
  const { data: cbzUsd, error: cbzUsdError } = await supabase
    .from('IncomingBankTransactions')
    .select('Amount')
    .eq('Bank', 'cbz')
    .eq('Currency', 'usd');
  const { data: cbzZwg, error: cbzZwgError } = await supabase
    .from('IncomingBankTransactions')
    .select('Amount')
    .eq('Bank', 'cbz')
    .eq('Currency', 'zwg');
  // ZB Net Revenue (USD, ZWG)
  const { data: zbUsd, error: zbUsdError } = await supabase
    .from('IncomingBankTransactions')
    .select('Amount')
    .eq('Bank', 'zb')
    .eq('Currency', 'usd');
  const { data: zbZwg, error: zbZwgError } = await supabase
    .from('IncomingBankTransactions')
    .select('Amount')
    .eq('Bank', 'zb')
    .eq('Currency', 'zwg');

  if (cbzUsdError || cbzZwgError || zbUsdError || zbZwgError) throw cbzUsdError || cbzZwgError || zbUsdError || zbZwgError;

  const sumAmounts = arr => (arr || []).reduce((sum, txn) => sum + (Number(txn.Amount) || 0), 0);

  return {
    totalStudents,
    studentsOwing,
    cbzRevenueUsd: sumAmounts(cbzUsd),
    cbzRevenueZwg: sumAmounts(cbzZwg),
    zbRevenueUsd: sumAmounts(zbUsd),
    zbRevenueZwg: sumAmounts(zbZwg),
  };
};

// Fetch student chart data (gender and grade distribution)
export const fetchStudentChartData = async () => {
  // Gender distribution
  const { data: students, error } = await supabase
    .from('Students')
    .select('Gender, Grade');
  if (error) throw error;
  const genderCounts = { Male: 0, Female: 0 };
  const gradeCounts = {};
  students.forEach(s => {
    if (s.Gender === 'Male') genderCounts.Male++;
    if (s.Gender === 'Female') genderCounts.Female++;
    gradeCounts[s.Grade] = (gradeCounts[s.Grade] || 0) + 1;
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
      labels: Object.keys(gradeCounts),
      datasets: [{
        data: Object.values(gradeCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCE56', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#FF638480', '#36A2EB80', '#4BC0C080', '#FFCE5680', '#9966FF80', '#FF9F4080']
      }]
    }
  };
};