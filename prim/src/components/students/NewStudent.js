import React, { useState } from 'react';
import supabase from '../../SupaBaseConfig';
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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent}>
                <input type="text" name="FirstNames" placeholder="First Names" value={newStudent.FirstNames} onChange={handleInputChange} className="border p-2 mr-2" />
                <input type="text" name="Surname" placeholder="Surname" value={newStudent.Surname} onChange={handleInputChange} className="border p-2 mr-2" />
                <input type="text" name="Gender" placeholder="Gender" value={newStudent.Gender} onChange={handleInputChange} className="border p-2 mr-2" />
                <input type="text" name="Grade" placeholder="Grade" value={newStudent.Grade} onChange={handleInputChange} className="border p-2 mr-2" />
                <input type="text" name="Class" placeholder="Class" value={newStudent.Class} onChange={handleInputChange} className="border p-2 mr-2" />
                <input type="text" name="ContactInfo" placeholder="Contact Info" value={newStudent.ContactInfo} onChange={handleInputChange} className="border p-2 mr-2" />
                <input type="text" name="Address" placeholder="Address" value={newStudent.Address} onChange={handleInputChange} className="border p-2 mr-2" />
                <input type="date" name="DOB" value={newStudent.DOB} onChange={handleInputChange} className="border p-2 mr-2" />
                <input type="text" name="Sponsor" placeholder="Sponsor" value={newStudent.Sponsor} onChange={handleInputChange} className="border p-2 mr-2" />
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Student</button>
            </form>
        </div>
    );
};

export default NewStudent;