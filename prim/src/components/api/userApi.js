import { supabase } from './../../db/SupaBaseConfig.js';
/**
 * Fetches the authenticated user and checks their role against required roles.
 * @param {Array<string>} requiredRoles - Array of roles that are allowed to access the resource.
 * @returns {Promise<Object>} The user data if authenticated and authorized.
 * @throws {Error} If not authenticated or unauthorized.
 */

export const fetchUser = async (requiredRoles = ['admin', 'bursar']) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('user_roles')
        .select('name, role')
        .eq('id', user.id)
        .maybeSingle();

    if (error) throw error;
    // Check if user role is in the required roles array
    if (!data || !requiredRoles.includes(data.role)) {
        throw new Error('Unauthorized role');
    }

    return data;
};