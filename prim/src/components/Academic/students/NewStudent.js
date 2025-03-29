import React, { useState } from 'react';
import supabase from '../../../SupaBaseConfig';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

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

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add New Student</h2>
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
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
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
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
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
    );
};

export default NewStudent;