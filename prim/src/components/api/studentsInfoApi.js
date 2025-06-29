import supabase from '../../db/SupaBaseConfig.js';

export const fetchStudents = async ({ gradeFilter, classFilter, genderFilter }) => {
    // Only check authentication, not role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch students
    let query = supabase.from('Students').select('*');
    if (gradeFilter) query = query.eq('Grade', gradeFilter);
    if (classFilter) query = query.eq('Class', classFilter);
    if (genderFilter) query = query.eq('Gender', genderFilter);
    const { data, error } = await query.order('Grade', { ascending: true });
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
    return (data || []).map(link => link.StudentID);
};