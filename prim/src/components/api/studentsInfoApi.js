import supabase from '../../db/SupaBaseConfig.js';

export const fetchStudents = async ({ gradeFilter, classFilter, genderFilter }) => {
    // First check if user has required role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userData, error: userError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    if (userError) throw userError;
    if (!userData || !['admin', 'bursar'].includes(userData.role)) {
        throw new Error('Unauthorized role');
    }

    // If role check passes, fetch students
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