import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import supabase from '../../../db/SupaBaseConfig';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import Loader from '../../ui/loader';
import TopBar from '../../ui/topbar';
import Form from '../../ui/form';
import { useToast } from '../../../contexts/ToastContext';
import { useTheme } from '../../../contexts/ThemeContext';

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
    const [submitting, setSubmitting] = useState(false);
    const { addToast } = useToast();
    const { currentTheme } = useTheme();

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
        // eslint-disable-next-line
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
        } catch (error) {
            addToast('Error fetching student details.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('Students')
                .update(student)
                .eq('id', studentId);

            if (error) throw error;

            addToast('Student details updated successfully!', 'success');
            navigate(`/student-view/${studentId}`);
        } catch (error) {
            addToast('Error updating student details.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || userLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: currentTheme.background?.default }}
            >
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{ background: currentTheme.background?.default, color: currentTheme.text?.primary }}
        >
            <TopBar title="Update Student Details" userName={userData?.name} />
            <div className="pt-5 px-6">
                <div className="container mx-auto mt-10">
                    <Form onSubmit={handleUpdateStudent} loading={submitting} title="Edit Student">
                        <Form.Input
                            label="First Names"
                            type="text"
                            name="FirstNames"
                            value={student.FirstNames}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="Surname"
                            type="text"
                            name="Surname"
                            value={student.Surname}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Select
                            label="Gender"
                            name="Gender"
                            value={student.Gender}
                            onChange={handleInputChange}
                            required
                            options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' }
                            ]}
                        />
                        <Form.Input
                            label="Grade"
                            type="text"
                            name="Grade"
                            value={student.Grade}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="Class"
                            type="text"
                            name="Class"
                            value={student.Class}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="Contact Info"
                            type="text"
                            name="ContactInfo"
                            value={student.ContactInfo}
                            onChange={handleInputChange}
                        />
                        <div>
                            <label className="block text-sm font-medium mb-1 text-left">Address</label>
                            <textarea
                                name="Address"
                                value={student.Address}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
                                style={{
                                    borderColor: currentTheme.divider,
                                    color: currentTheme.text.primary,
                                    background: currentTheme.background.paper
                                }}
                                rows="3"
                            ></textarea>
                        </div>
                        <Form.Input
                            label="Date of Birth"
                            type="date"
                            name="DOB"
                            value={student.DOB}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="Sponsor"
                            type="text"
                            name="Sponsor"
                            value={student.Sponsor}
                            onChange={handleInputChange}
                        />
                        <div className="flex justify-end">
                            <Link
                                to={`/student-view/${studentId}`}
                                className="mr-4 px-4 py-2 rounded"
                                style={{
                                    background: currentTheme.background.paper,
                                    color: currentTheme.text.primary,
                                    border: `1px solid ${currentTheme.divider}`
                                }}
                            >
                                Back to Student
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default StudentUpdate;