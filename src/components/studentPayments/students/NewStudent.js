import React, { useState } from 'react';
import Modal from '../../ui/modal';
import Form from '../../ui/form';
import Loader from '../../ui/loader';

const initialStudent = {
    firstNames: '',
    surname: '',
    gender: '',
    grade: '',
    class: '',
    contactInfo: '',
    address: '',
    dob: '',
    sponsor: 'self',
    status: 'active'
};

const gradeOptions = [
    { value: 'ECD A', label: 'ECD A' },
    { value: 'ECD B', label: 'ECD B' },
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
];

const classOptions = [
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
];

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

const NewStudent = ({
    open,
    onClose,
    onSubmit,
    loading,
    currentTheme
}) => {
    const [student, setStudent] = useState(initialStudent);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleRadioChange = (e) => {
        setStudent({ ...student, gender: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Set default owing fields for DB schema
        const payload = {
            ...student,
            levyOwing: 0,
            tuitionOwing: 0,
            examFee: 0,
            otherOwing: 0
        };
        onSubmit(payload);
    };

    return (
        <Modal open={open} onClose={onClose}>
            {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader type="card" count={1} />
                </div>
            ) : (
                <Form onSubmit={handleSubmit} loading={loading} title="Student Details">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Form.Input
                            label="Surname"
                            type="text"
                            name="surname"
                            placeholder="Surname"
                            value={student.surname}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="First Names"
                            type="text"
                            name="firstNames"
                            placeholder="First Names"
                            value={student.firstNames}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="Contact Info"
                            type="text"
                            name="contactInfo"
                            placeholder="Contact Info"
                            value={student.contactInfo}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            label="Sponsor"
                            type="text"
                            name="sponsor"
                            placeholder="Sponsor"
                            value={student.sponsor}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-end mt-4">
                        <Form.Select
                            label="Grade"
                            name="grade"
                            value={student.grade}
                            onChange={handleInputChange}
                            required
                            options={gradeOptions}
                        />
                        <Form.Select
                            label="Class"
                            name="class"
                            value={student.class}
                            onChange={handleInputChange}
                            required
                            options={classOptions}
                        />
                        <div className="flex flex-col w-full">
                            <label className="block text-sm font-medium mb-1 text-left">Gender</label>
                            <div className="flex items-center space-x-4">
                                {genderOptions.map(opt => (
                                    <label key={opt.value} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={opt.value}
                                            checked={student.gender === opt.value}
                                            onChange={handleRadioChange}
                                            className="mr-2 focus:ring-blue-500"
                                            required
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-left">Address</label>
                        <textarea
                            name="address"
                            placeholder="Address"
                            value={student.address}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            required
                            style={{
                                background: currentTheme?.background?.paper,
                                color: currentTheme?.text?.primary,
                                border: `1px solid ${currentTheme?.divider || '#d1d5db'}`
                            }}
                        ></textarea>
                    </div>
                    <Form.Input
                        label="Date of Birth"
                        type="date"
                        name="dob"
                        value={student.dob}
                        onChange={handleInputChange}
                        required
                    />
                </Form>
            )}
        </Modal>
    );
};

export default NewStudent;