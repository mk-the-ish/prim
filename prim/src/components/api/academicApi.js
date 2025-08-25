import supabase from '../../db/SupaBaseConfig';

// Fetch all grades for a student
export const fetchStudentGrades = async (studentId, { limit } = {}) => {
    let query = supabase
        .from('Grades')
        .select('*')
        .eq('StudentID', studentId)
        .order('TermID', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

// Fetch all grades for a class (by grade and class)
export const fetchClassGrades = async (grade, className) => {
    // Get all students in the class
    const { data: students, error: studentsError } = await supabase
        .from('Students')
        .select('id')
        .eq('Grade', grade)
        .eq('Class', className);
    if (studentsError) throw studentsError;
    const studentIds = (students || []).map(s => s.id);
    if (studentIds.length === 0) return [];
    // Get all grades for those students
    const { data: grades, error: gradesError } = await supabase
        .from('Grades')
        .select('*')
        .in('StudentID', studentIds);
    if (gradesError) throw gradesError;
    return grades;
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

export const fetchTeacherClassAndGrade = async (userId) => {
    const { data, error } = await supabase
        .from('classteachers')
        .select('class, grade')
        .eq('userid', userId)
        .maybeSingle();
    if (error) throw error;
    return data || { class: '', grade: '' };
};

