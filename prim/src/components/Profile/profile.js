import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, CogIcon } from '@heroicons/react/24/outline';
import supabase from '../../db/SupaBaseConfig';
import { useTheme } from '../../contexts/ThemeContext';

const Profile = () => {
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not found');

            setUser(user);

            // Fetch additional user details from user_roles table
            const { data, error } = await supabase
                .from('user_roles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (error) throw error;
            if (!data) {
                // If no user_role exists, create one with default values
                const { data: newUserRole, error: createError } = await supabase
                    .from('user_roles')
                    .insert([{
                        id: user.id,
                        name: user.email.split('@')[0], // Use email username as default name
                        role: 'viewer' // Default role
                    }])
                    .select()
                    .single();

                if (createError) throw createError;
                setUserDetails(newUserRole);
                setFormData({
                    name: newUserRole.name,
                    role: newUserRole.role
                });
            } else {
                setUserDetails(data);
                setFormData({
                    name: data.name,
                    role: data.role
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('user_roles')
                .update({
                    name: formData.name,
                    role: formData.role
                })
                .eq('id', user.id);

            if (error) throw error;

            setUserDetails(prev => ({
                ...prev,
                ...formData
            }));
            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.background?.default }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: currentTheme.primary?.main || '#3b82f6' }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8" style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}>
            <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden" style={{ background: currentTheme.background?.paper, color: currentTheme.text?.primary }}>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl text-center font-bold" style={{ color: currentTheme.text?.primary }}>Profile</h2>
                        <button
                            onClick={() => navigate('/settings')}
                            style={{ color: currentTheme.text?.secondary }}
                            className="hover:opacity-80"
                        >
                            <CogIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 border-l-4 p-4 rounded" style={{ background: currentTheme.error?.light || '#fef2f2', borderColor: currentTheme.error?.main || '#f87171' }}>
                            <p className="text-sm" style={{ color: currentTheme.error?.main || '#b91c1c' }}>{error}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-center mb-6">
                        <UserCircleIcon className="h-24 w-24" style={{ color: currentTheme.text?.disabled || '#9ca3af' }} />
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium" style={{ color: currentTheme.text?.secondary }}>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary, borderColor: currentTheme.divider }}
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm font-medium border rounded-md hover:opacity-80"
                                    style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary, borderColor: currentTheme.divider }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium rounded-md hover:opacity-80"
                                    style={{ background: currentTheme.primary?.main, color: currentTheme.primary?.contrastText }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium" style={{ color: currentTheme.text?.secondary }}>Email</h3>
                                <p className="mt-1 text-sm" style={{ color: currentTheme.text?.primary }}>{user?.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium" style={{ color: currentTheme.text?.secondary }}>Name</h3>
                                <p className="mt-1 text-sm" style={{ color: currentTheme.text?.primary }}>{userDetails?.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium" style={{ color: currentTheme.text?.secondary }}>Role</h3>
                                <p className="mt-1 text-sm" style={{ color: currentTheme.text?.primary }}>{userDetails?.role}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 w-full px-4 py-2 text-sm font-medium rounded-md hover:opacity-80"
                                style={{ background: currentTheme.primary?.light, color: currentTheme.primary?.main }}
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t" style={{ borderColor: currentTheme.divider }}>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-sm font-medium rounded-md hover:opacity-80"
                            style={{ background: currentTheme.error?.main, color: currentTheme.error?.contrastText }}
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;