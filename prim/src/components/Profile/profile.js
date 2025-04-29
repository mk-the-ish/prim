import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, CogIcon } from '@heroicons/react/24/outline';
import supabase from '../../SupaBaseConfig';

const Profile = () => {
    const navigate = useNavigate();
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl text-center font-bold text-gray-900">Profile</h2>
                        <button
                            onClick={() => navigate('/settings')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <CogIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-center mb-6">
                        <UserCircleIcon className="h-24 w-24 text-gray-400" />
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="mt-1 text-sm text-gray-900">{userDetails?.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                                <p className="mt-1 text-sm text-gray-900">{userDetails?.role}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
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