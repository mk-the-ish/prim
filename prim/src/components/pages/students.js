import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        FullName: '',
        StudentID: '',
        levy_owing: '',
        tuition_owing: '',
        Sex: '',
        Grade: '',
        Class: '',
        contact_details: '',
        Address: '',
        DOB: new Date(),
        Sponsor: '',
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const navigate = useNavigate(); // Initialize useNavigate hook

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'Students'));
            const studentList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStudents(studentList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'Students'), where('FullName', '>=', searchTerm), where('FullName', '<=', searchTerm + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            const searchResults = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStudents(searchResults);
            setLoading(false);
        } catch (error) {
            console.error('Error searching students:', error);
            setLoading(false);
        }
    };

    const openModal = (student = null) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        if (student) {
            setFormData(student);
        } else {
            setFormData({
                FullName: '',
                StudentID: '',
                levy_owing: '',
                tuition_owing: '',
                Sex: '',
                Grade: '',
                Class: '',
                contact_details: '',
                Address: '',
                DOB: new Date(),
                Sponsor: '',
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedStudent) {
                await updateDoc(doc(db, 'Students', selectedStudent.id), formData);
                toast.success('Student updated successfully!');
            } else {
                await addDoc(collection(db, 'Students'), formData);
                toast.success('Student added successfully!');
            }
            fetchStudents();
            closeModal();
        } catch (error) {
            console.error('Error handling form:', error);
            toast.error('Error handling form!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'Students', id));
            fetchStudents();
            toast.success('Student deleted successfully!');
        } catch (error) {
            console.error('Error deleting student:', error);
            toast.error('Error deleting student!');
        }
    };

    const handleView = (studentId) => {
        navigate(`/student-view/${studentId}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <ToastContainer />
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by First Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded p-2 mr-2"
                />
                <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Search
                </button>
                <button onClick={() => openModal()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Student
                </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{student.FullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.Gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.Grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.Class}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button onClick={() => openModal(student)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
                                <button onClick={() => handleDelete(student.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">Delete</button>
                                <button onClick={() => handleView(student.id)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form className="p-4" onSubmit={handleSubmit}>
                                {/* Form Inputs */}
                                <div className="mb-4">
                                    <label htmlFor="FullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                    <input type="text" name="FullName" value={formData.FullName} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="StudentID" className="block text-gray-700 text-sm font-bold mb-2">Student ID</label>
                                    <input type="text" name="StudentID" value={formData.studentID} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="Sex" className="block text-gray-700 text-sm font-bold mb-2">Sex</label>
                                    <input type="text" name="Sex" value={formData.Sex} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="Grade" className="block text-gray-700 text-sm font-bold mb-2">Grade</label>
                                    <input type="text" name="Grade" value={formData.Grade} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="Class" className="block text-gray-700 text-sm font-bold mb-2">Class</label>
                                    <input type="text" name="Class" value={formData.Class} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="contact_details" className="block text-gray-700 text-sm font-bold mb-2">Contact Info</label>
                                    <input type="text" name="contact_details" value={formData.contact_details} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="Address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                                    <input type="text" name="Address" value={formData.Address} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="DOB" className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                                    <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="levy_owing" className="block text-gray-700 text-sm font-bold mb-2">Levy Owing</label>
                                    <input type="text" name="levy_owing" value={formData.levy_owing} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="tuition_owing" className="block text-gray-700 text-sm font-bold mb-2">Tuition Owing</label>
                                    <input type="text" name="tuition_owing" value={formData.tuition_owing} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="Sponsor" className="block text-gray-700 text-sm font-bold mb-2">Sponsor</label>
                                    <input type="text" name="Sponsor" value={formData.Sponsor} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        {selectedStudent ? 'Update' : 'Add'} Student
                                    </button>
                                    <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;