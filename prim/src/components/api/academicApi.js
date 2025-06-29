import supabase from '../../db/SupaBaseConfig';

// Fetch all grades for a student
export const fetchStudentGrades = async (studentId, { limit } = {}) => {
    let query = supabase
        .from('Grades')
        .select('*, Terms(term), subjects(name)')
        .eq('StudentID', studentId)
        .order('TermID', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

// Fetch all attendance records for a student
export const fetchStudentAttendance = async (studentId) => {
    const { data, error } = await supabase
        .from('Attendance')
        .select('*')
        .eq('StudentID', studentId)
        .order('Date', { ascending: false });
    if (error) throw error;
    return data;
};

