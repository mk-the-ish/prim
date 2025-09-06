import supabase from '../../db/SupaBaseConfig.js';

export const fetchStudents = async ({ gradeFilter, classFilter, genderFilter }) => {
    // Only check authentication, not role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch students
    let query = supabase.from('Students').select('*');
    if (gradeFilter) query = query.eq('grade', gradeFilter);
    if (classFilter) query = query.eq('class', classFilter);
    if (genderFilter) query = query.eq('gender', genderFilter);
    const { data, error } = await query.order('grade', { ascending: true });
    if (error) throw error;
    return data;
};

export const fetchStudentDetails = async (studentId) => {
    const { data, error } = await supabase
        .from('Students')
        .select('*')
        .eq('id', studentId)
        .single();

    if (error) throw error;
    return data;
};

// Fetch the linked student ID(s) for the currently logged-in parent
export const fetchLinkedStudentIdsForParent = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get the parent user id (should match user_roles.id)
    const parentUserId = user.id;
    const { data, error } = await supabase
        .from('parent_student_link')
        .select('StudentID')
        .eq('ParentUserID', parentUserId);
    if (error) throw error;
    // Return an array of student IDs (supporting multiple children)
    return data;
};

export async function fetchStudentById(studentId) {
    const { data, error } = await supabase
        .from('Students')
        .select('*')
        .eq('id', studentId)
        .single();
    if (error) return null;
    return data;
}

export async function fetchStudentPayments(studentId) {
    const { data, error } = await supabase
        .from('Fees')
        .select('*')
        .eq('studentId', studentId)
        .order('created_at', { ascending: false });
    if (error) return [];
    return data;
}