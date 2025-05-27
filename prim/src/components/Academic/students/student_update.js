import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import supabase from '../../../SupaBaseConfig';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api';


const StudentUpdate = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({
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
    const [loading, setLoading] = useState(true);

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        onError: () => navigate('/login'),
        onSuccess: (data) => {
            if (!data || !['admin', 'bursar'].includes(data.role)) {
                navigate('/unauthorised');
            }
        }
    });

    useEffect(() => {
        fetchStudentDetails();
    }, [studentId]);

    const fetchStudentDetails = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Students')
                .select('*')
                .eq('id', studentId)
                .single();

            if (error) throw error;
            setStudent(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student details:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('Students')
                .update(student)
                .eq('id', studentId);

            if (error) throw error;

            alert('Student details updated successfully!');
            navigate(`/student-view/${studentId}`); // Redirect back to the student view page
        } catch (error) {
            console.error('Error updating student details:', error);
        }
    };

    if (loading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Fixed Header */}
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <Link to="/profile" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                    <FaUserCircle className="text-lg" />
                    <span className="ml-4">{userData?.name || 'Profile'}</span>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">Update Student Details</h1>
                <Link
                    to={`/student-view/${studentId}`}
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                    Back to Student
                </Link>
            </div>

            {/* Main Content */}
            <div className="pt-5 px-6">
                <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
                    <form onSubmit={handleUpdateStudent} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">First Names</label>
                            <input
                                type="text"
                                name="FirstNames"
                                value={student.FirstNames}
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
                                value={student.Surname}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Gender</label>
                            <select
                                name="Gender"
                                value={student.Gender}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Grade</label>
                            <input
                                type="text"
                                name="Grade"
                                value={student.Grade}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Class</label>
                            <input
                                type="text"
                                name="Class"
                                value={student.Class}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Contact Info</label>
                            <input
                                type="text"
                                name="ContactInfo"
                                value={student.ContactInfo}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Address</label>
                            <textarea
                                name="Address"
                                value={student.Address}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Date of Birth</label>
                            <input
                                type="date"
                                name="DOB"
                                value={student.DOB}
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
                                value={student.Sponsor}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Update Student
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentUpdate;