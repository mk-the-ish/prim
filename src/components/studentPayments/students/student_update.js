import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../db/SupaBaseConfig';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchUser } from '../../api/userApi';
import Loader from '../../ui/loader';
import Form from '../../ui/form';
import { useToast } from '../../../contexts/ToastContext';
import { useTheme } from '../../../contexts/ThemeContext';

const StudentUpdate = ({ studentId: propStudentId, onSuccess }) => {
    const params = useParams();
    const studentId = propStudentId || params.studentId;
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
    const { addToast } = useToast();
    const { currentTheme } = useTheme();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
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

    const mutation = useMutation({
        mutationFn: async (updatedStudent) => {
            const { error } = await supabase
                .from('Students')
                .update(updatedStudent)
                .eq('id', studentId);
            if (error) throw error;
        },
        onSuccess: () => {
            addToast('Student details updated successfully!', 'success');
            if (onSuccess) onSuccess();
        },
        onError: () => {
            addToast('Error updating student details.', 'error');
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleUpdateStudent = (e) => {
        e.preventDefault();
        mutation.mutate(student);
    };

    if (loading || userLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader type="card" count={1} />
            </div>
        );
    }

    return (
        <Form onSubmit={handleUpdateStudent} loading={mutation.isLoading} title="Edit Student">
            {/* Surname, FirstNames, Contact Info, Sponsor side by side */}
            <div className="flex flex-col md:flex-row gap-4">
                <Form.Input
                    label="Surname"
                    type="text"
                    name="Surname"
                    value={student.Surname}
                    onChange={handleInputChange}
                    required
                />
                <Form.Input
                    label="First Names"
                    type="text"
                    name="FirstNames"
                    value={student.FirstNames}
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
                <Form.Input
                    label="Sponsor"
                    type="text"
                    name="Sponsor"
                    value={student.Sponsor}
                    onChange={handleInputChange}
                />
            </div>
            {/* Grade, Class, Gender side by side */}
            <div className="flex flex-col md:flex-row gap-4 items-end mt-4">
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
            </div>
            {/* Address full width */}
            <div className="mt-4">
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
            {/* Date of Birth full width */}
            <Form.Input
                label="Date of Birth"
                type="date"
                name="DOB"
                value={student.DOB}
                onChange={handleInputChange}
                required
            />
        </Form>
    );
};

export default StudentUpdate;