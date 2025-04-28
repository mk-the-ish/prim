import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthProvider.js';
import ProtectedRoute from './Auth/protectedRoute.js';
import Login from './Auth/login.js';
import Signup from './Auth/signup.js';
import ForgotPassword from './Auth/forgotPassword.js';
import Layout from './Academic/layout.js';
import Students from './Academic/students/students.js';
import NewStudent from './Academic/students/NewStudent.js';
import Levy from './Academic/levy/levy.js';
import StudentView from './Academic/students/StudentView.js';
import Tuition from './Academic/tuition/tuition.js';
import NewCommIn from './Academic/commission/newCommIN.js';
import NewCommOut from './Academic/commission/newCommOut.js';
import Commission from './Academic/commission/commission.js';
import StudentUpdate from './Academic/students/student_update.js';
import NewLevyUSD from './Academic/levy/newLevyUSD.js';
import NewLevyZWG from './Academic/levy/newLevyZWG.js';
import NewTuitionUSD from './Academic/tuition/newTuitionUSD.js';
import NewTuitionZWG from './Academic/tuition/newTuitionZWG.js';
import Financials from './Financials/financials.js';
import Report from './Academic/reports/report.js';
import Invoice from './Academic/reports/invoice.js';
import AdminDashboard from './Academic/Dashboard/dashboard.js';
import BulkInvoicing from './Academic/Dashboard/bulkInvoicing.js';
import TopBar from './Academic/txn/topbar.js';


function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<Login />} />

          <Route path="/dashboard" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/bulk-invoicing" element={<ProtectedRoute><Layout><BulkInvoicing /></Layout></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><Layout><Students /></Layout></ProtectedRoute>} />
          <Route path="/new-student" element={<ProtectedRoute><Layout><NewStudent /></Layout></ProtectedRoute>} />
          <Route path="/student-view/:studentId" element={<ProtectedRoute><Layout><StudentView /></Layout></ProtectedRoute>} />
          <Route path="/student_update/:studentId" element={<ProtectedRoute><Layout><StudentUpdate /></Layout></ProtectedRoute>} />
          <Route path="/levy" element={<ProtectedRoute><Layout><Levy /></Layout></ProtectedRoute>} />
          <Route path="/newLevyUSD/:studentId" element={<ProtectedRoute><Layout><NewLevyUSD /></Layout></ProtectedRoute>} />
          <Route path="/newLevyZWG/:studentId" element={<ProtectedRoute><Layout><NewLevyZWG /></Layout></ProtectedRoute>} />
          <Route path="/tuition" element={<ProtectedRoute><Layout><Tuition /></Layout></ProtectedRoute>} />
          <Route path="/newTuitionUSD/:studentId" element={<ProtectedRoute><Layout><NewTuitionUSD /></Layout></ProtectedRoute>} />
          <Route path="/newTuitionZWG/:studentId" element={<ProtectedRoute><Layout><NewTuitionZWG /></Layout></ProtectedRoute>} />
          <Route path="/commission" element={<ProtectedRoute><Layout><Commission /></Layout></ProtectedRoute>} />
          <Route path="/newCommIn" element={<ProtectedRoute><Layout><NewCommIn /></Layout></ProtectedRoute>} />
          <Route path="/newCommOut" element={<ProtectedRoute><Layout><NewCommOut /></Layout></ProtectedRoute>} />
          <Route path="/txn" element={<ProtectedRoute><Layout><TopBar /></Layout></ProtectedRoute>} /><Route path="/newTuitionUSD/:studentId" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><Report /></Layout></ProtectedRoute>} />
          <Route path="/invoice/:studentId" element={<ProtectedRoute><Layout><Invoice /></Layout></ProtectedRoute>} />
          <Route path="/financials" element={<ProtectedRoute><Layout><Financials /></Layout></ProtectedRoute>} />
          <Route path="*" element={<ProtectedRoute><Layout><h1> 404 - Not Found</h1></Layout></ProtectedRoute>} />



        </Routes>
      </div>
    </AuthProvider>

  );
}


function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;