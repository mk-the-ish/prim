import supabase from './../../db/SupaBaseConfig.js';

/**
 * Fetches the authenticated user.
 * @returns {Promise<Object>} The user data if authenticated.
 * @throws {Error} If not authenticated.
 */
export const fetchUser = async () => {
    try {
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

        return data;

    } catch (error) {
        // Log error for debugging
        console.error('User API Error:', {
            message: error.message,
            stack: error.stack
        });

        // Rethrow with more specific message
        throw new Error(
            `Failed to fetch user data: ${error.message || 'Unknown error'}`
        );
    }
};