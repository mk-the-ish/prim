import supabase from './../../db/SupaBaseConfig.js';

/**
 * Fetches the authenticated user and checks their role against required roles.
 * @param {Array<string>} requiredRoles - Array of roles that are allowed to access the resource.
 * @returns {Promise<Object>} The user data if authenticated and authorized.
 * @throws {Error} If not authenticated or unauthorized.
 */
export const fetchUser = async (requiredRoles = ['admin', 'bursar']) => {
    try {
        // Validate requiredRoles parameter
        if (!Array.isArray(requiredRoles)) {
            throw new Error('requiredRoles must be an array');
        }

        if (requiredRoles.length === 0) {
            throw new Error('requiredRoles cannot be empty');
        }

        // Check if Supabase client is initialized
        if (!supabase) {
            throw new Error('Database connection not initialized');
        }

        // Get user with timeout
        const userPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 5000)
        );

        const { data: { user } } = await Promise.race([userPromise, timeoutPromise]);

        if (!user) {
            throw new Error('Not authenticated');
        }

        // Check if user exists in user_roles table
        const { data, error, status } = await supabase
            .from('user_roles')
            .select('name, role')
            .eq('id', user.id)
            .maybeSingle();

        // Specific error handling
        if (error) {
            switch (status) {
                case 404:
                    throw new Error('User role not found');
                case 403:
                    throw new Error('Access forbidden');
                case 429:
                    throw new Error('Too many requests');
                default:
                    throw new Error(`Database error: ${error.message}`);
            }
        }

        if (!data) {
            throw new Error('User data not found');
        }

        if (!requiredRoles.includes(data.role)) {
            throw new Error(`Unauthorized role: ${data.role}. Required roles: ${requiredRoles.join(', ')}`);
        }

        return data;

    } catch (error) {
        // Log error for debugging
        console.error('User API Error:', {
            message: error.message,
            requiredRoles,
            stack: error.stack
        });

        // Rethrow with more specific message
        throw new Error(
            `Failed to fetch user data: ${error.message || 'Unknown error'}`
        );
    }
};