import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase-config';
import { doc, getDoc, collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';

const StudentView = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [levyPayments, setLevyPayments] = useState([]);
    const [showAddLevyForm, setShowAddLevyForm] = useState(false);
    const [newLevy, setNewLevy] = useState({
        amount_USD: '',
        description: '',
        paymentMethod: '',
        studentID: studentId, // Pre-filled with studentId
    });

    useEffect(() => {
        fetchStudentData();
        fetchLevyPayments();
    }, [studentId]);

    const fetchStudentData = async () => {
        try {
            const docRef = doc(db, 'students', studentId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStudent({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const fetchLevyPayments = async () => {
        try {
            const levyRef = collection(db, 'levy', 'btrGEKsIrwXbSC5MzzxZ', 'students');
            const q = query(levyRef, where('studentID', '==', studentId), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const payments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLevyPayments(payments);
        } catch (error) {
            console.error('Error fetching levy payments:', error);
        }
    };

    const handleLevyChange = (e) => {
        setNewLevy({ ...newLevy, [e.target.name]: e.target.value });
    };

    const handleAddLevyPayment = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'levy', 'btrGEKsIrwXbSC5MzzxZ', 'students'), {
                ...newLevy,
                date: new Date(),
                studentName: student.FirstNames + ' ' + student.Surname,
            });
            fetchLevyPayments();
            setNewLevy({ amount_USD: '', description: '', paymentMethod: '', studentID: studentId });
            setShowAddLevyForm(false);
        } catch (error) {
            console.error('Error adding levy payment:', error);
        }
    };

    if (!student) return <p>Loading...</p>;

    return (
        <div className="flex">
            <div className="w-1/2 p-4 border-r">
                <h2 className="text-2xl font-semibold mb-4">Student Information</h2>
                <p><strong>Full Name:</strong> {student.FirstNames} {student.Surname}</p>
                <p><strong>Gender:</strong> {student.Gender}</p>
                <p><strong>Grade:</strong> {student.Grade}</p>
                <p><strong>Class:</strong> {student.Class}</p>
                <p><strong>Contact Info:</strong> {student.ContactInfo}</p>
                <p><strong>Address:</strong> {student.Address}</p>
                <p><strong>Date of Birth:</strong> {new Date(student.DOB.seconds * 1000).toLocaleDateString()}</p>
                <p><strong>Sponsor:</strong> {student.Sponsor}</p>
            </div>
            <div className="w-1/2 p-4">
                <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
                <h3 className="text-lg font-semibold mb-2">Levy Payments</h3>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (USD)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {levyPayments.map(payment => (
                            <tr key={payment.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.amount_USD}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.date.toDate().toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => setShowAddLevyForm(!showAddLevyForm)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                    {showAddLevyForm ? 'Hide Form' : 'Add Levy Payment'}
                </button>
                {showAddLevyForm && (
                    <form onSubmit={handleAddLevyPayment} className="mb-4">
                        <input type="number" name="amount_USD" placeholder="Amount (USD)" value={newLevy.amount_USD} onChange={handleLevyChange} className="border p-2 mr-2" />
                        <input type="text" name="description" placeholder="Description" value={newLevy.description} onChange={handleLevyChange} className="border p-2 mr-2" />
                        <input type="text" name="paymentMethod" placeholder="Payment Method" value={newLevy.paymentMethod} onChange={handleLevyChange} className="border p-2 mr-2" />
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Payment</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StudentView;