import React, { useState, useEffect } from 'react';
import supabase from '../../../db/SupaBaseConfig';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../ui/topbar';
import Loader from '../../ui/loader';
import Form from '../../ui/form';
import { fetchUser } from '../../api/userApi';
import { useToast } from '../../../contexts/ToastContext';

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
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const user = await fetchUser(['admin', 'bursar']);
                setUserName(user.name);
                setUserRole(user.role);
                if (!['admin', 'bursar'].includes(user.role)) {
                    addToast("You don't have permission to view this page.", 'error');
                    navigate('/unauthorised');
                }
                setLoading(false);
            } catch (error) {
                addToast(error.message || 'Error fetching user data.', 'error');
                if (error.message?.toLowerCase().includes('unauthorized')) {
                    navigate('/unauthorised');
                } else {
                    navigate('/login');
                }
            }
        };
        fetchUserName();
        // eslint-disable-next-line
    }, []);

    const handleInputChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase.from('Students').insert([newStudent]);
            if (error) throw error;
            addToast('Student added successfully!', 'success');
            navigate('/students');
        } catch (error) {
            addToast('Error adding student.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <TopBar title="Add New Student" userName={userName} />
            <div className="px-6">
                <Form onSubmit={handleAddStudent} loading={submitting} title="Student Details">
                    <Form.Input
                        label="First Names"
                        type="text"
                        name="FirstNames"
                        placeholder="First Names"
                        value={newStudent.FirstNames}
                        onChange={handleInputChange}
                        required
                    />
                    <Form.Input
                        label="Surname"
                        type="text"
                        name="Surname"
                        placeholder="Surname"
                        value={newStudent.Surname}
                        onChange={handleInputChange}
                        required
                    />
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
                    <Form.Select
                        label="Grade"
                        name="Grade"
                        value={newStudent.Grade}
                        onChange={handleInputChange}
                        required
                        options={[
                            { value: 'ECD A', label: 'ECD A' },
                            { value: 'ECD B', label: 'ECD B' },
                            { value: '1', label: 'Grade 1' },
                            { value: '2', label: 'Grade 2' },
                            { value: '3', label: 'Grade 3' },
                            { value: '4', label: 'Grade 4' },
                            { value: '5', label: 'Grade 5' },
                            { value: '6', label: 'Grade 6' },
                            { value: '7', label: 'Grade 7' },
                        ]}
                    />
                    <Form.Select
                        label="Class"
                        name="Class"
                        value={newStudent.Class}
                        onChange={handleInputChange}
                        required
                        options={[
                            { value: 'blue', label: 'Blue' },
                            { value: 'orange', label: 'Orange' },
                            { value: 'yellow', label: 'Yellow' },
                            { value: 'pink', label: 'Pink' },
                            { value: 'white', label: 'White' },
                            { value: 'maroon', label: 'Maroon' },
                            { value: 'red', label: 'Red' },
                            { value: 'green', label: 'Green' },
                            { value: 'brown', label: 'Brown' },
                            { value: 'purple', label: 'Purple' },
                        ]}
                    />
                    <Form.Input
                        label="Contact Info"
                        type="text"
                        name="ContactInfo"
                        placeholder="Contact Info"
                        value={newStudent.ContactInfo}
                        onChange={handleInputChange}
                        required
                    />
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
                    <Form.Input
                        label="Date of Birth"
                        type="date"
                        name="DOB"
                        value={newStudent.DOB}
                        onChange={handleInputChange}
                        required
                    />
                    <Form.Input
                        label="Sponsor"
                        type="text"
                        name="Sponsor"
                        placeholder="Sponsor"
                        value={newStudent.Sponsor}
                        onChange={handleInputChange}
                        required
                    />
                </Form>
            </div>
        </div>
    );
};

export default NewStudent;