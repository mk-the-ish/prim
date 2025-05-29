import React, { useState, useEffect } from 'react';
import supabase from '../../../db/SupaBaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const NewStudent = () => {
    const [newStudent, setNewStudent] = useState({
        FirstNames: '',
        Surname: '',
        Gender: '',
        Grade: '',
        Class: '',
        ContactInfo: '',
        Address: '',
        DOB: '',
        Sponsor: '',
    });
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserName();
    }, []);

    const fetchUserName = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            const { data, error } = await supabase
                .from('user_roles')
                .select('name, role')
                .eq('id', user.id)
                .maybeSingle();

            if (error) throw error;

            setUserName(data.name);
            setUserRole(data.role);

            if (!['admin', 'bursar'].includes(data.role)) {
                navigate('/unauthorised');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            navigate('/login');
        }
    };

    const handleInputChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('Students').insert([newStudent]);

        if (error) {
            console.error('Error adding student:', error);
        } else {
            navigate('/students'); // Redirect back to the Students page
        }
    };

    if (loading || !userRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!['admin', 'bursar'].includes(userRole)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Unauthorized Access</h2>
                    <p className="text-gray-600">You don't have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userName || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Add New Student</h1>
            </div>
            <div className="px-6">
                <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
                    <form onSubmit={handleAddStudent} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">First Names</label>
                            <input
                                type="text"
                                name="FirstNames"
                                placeholder="First Names"
                                value={newStudent.FirstNames}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Surname</label>
                            <input
                                type="text"
                                name="Surname"
                                placeholder="Surname"
                                value={newStudent.Surname}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Gender</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="Gender"
                                        value="Male"
                                        checked={newStudent.Gender === 'Male'}
                                        onChange={handleInputChange}
                                        className="mr-2 focus:ring-blue-500"
                                        required
                                    />
                                    Male
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="Gender"
                                        value="Female"
                                        checked={newStudent.Gender === 'Female'}
                                        onChange={handleInputChange}
                                        className="mr-2 focus:ring-blue-500"
                                        required
                                    />
                                    Female
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Grade</label>
                            <select
                                name="Grade"
                                value={newStudent.Grade}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Grade</option>
                                <option value="ECD A">ECD A</option>
                                <option value="ECD B">ECD B</option>
                                <option value="1">Grade 1</option>
                                <option value="2">Grade 2</option>
                                <option value="3">Grade 3</option>
                                <option value="4">Grade 4</option>
                                <option value="5">Grade 5</option>
                                <option value="6">Grade 6</option>
                                <option value="7">Grade 7</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Class</label>
                            <select
                                name="Class"
                                value={newStudent.Class}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Class</option>
                                <option value="blue">blue</option>
                                <option value="orange">orange</option>
                                <option value="yellow">yellow</option>
                                <option value="pink">pink</option>
                                <option value="white">white</option>
                                <option value="maroon">maroon</option>
                                <option value="red">red</option>
                                <option value="green">green</option>
                                <option value="brown">brown</option>
                                <option value="purple">purple</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Contact Info</label>
                            <input
                                type="text"
                                name="ContactInfo"
                                placeholder="Contact Info"
                                value={newStudent.ContactInfo}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Address</label>
                            <textarea
                                name="Address"
                                placeholder="Address"
                                value={newStudent.Address}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Date of Birth</label>
                            <input
                                type="date"
                                name="DOB"
                                value={newStudent.DOB}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Sponsor</label>
                            <input
                                type="text"
                                name="Sponsor"
                                placeholder="Sponsor"
                                value={newStudent.Sponsor}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Add Student
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default NewStudent;