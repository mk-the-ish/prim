import { useEffect, useState } from 'react';
import supabase from '../db/SupaBaseConfig';

export function useUserRole() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data, error } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('id', user.id)
                    .maybeSingle();
                setRole(data?.role || null);
            }
            setIsLoading(false);
        };
        fetchRole();
    }, []);

    return { user, role, isLoading };
}