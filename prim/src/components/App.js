import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider.js';
import ProtectedRoute from './auth/protectedRoute.js';
import Login from './auth/login.js';
import Signup from './auth/signup.js';
import ForgotPassword from './auth/forgotPassword.js';
import Sidebar from './layouts/Sidebar.js';
import Students from './studentPayments/students/students.js';
import NewStudent from './studentPayments/students/NewStudent.js';
import Levy from './studentPayments/levy/levy.js';
import StudentView from './studentPayments/students/StudentView.js';
import Tuition from './studentPayments/tuition/tuition.js';
import NewCommIn from './cashTransactions/commission/in/commIN.js';
import NewCommOut from './cashTransactions/commission/out/commOUT.js';
import Commission from './cashTransactions/commission/commission.js';
import StudentUpdate from './studentPayments/students/student_update.js';
import NewLevyUSD from './studentPayments/levy/newLevyUSD.js';
import NewLevyZWG from './studentPayments/levy/newLevyZWG.js';
import NewTuitionUSD from './studentPayments/tuition/newTuitionUSD.js';
import NewTuitionZWG from './studentPayments/tuition/newTuitionZWG.js';
import Financials from './layouts/financialsTopbar.js';
import Report from './studentPayments/reports/report.js';
import Invoice from './studentPayments/reports/invoice.js';
import AdminDashboard from './dashboard/dashboard.js';
import BulkInvoicing from './dashboard/bulkInvoicing.js';
import TopBar from './layouts/TransactionsTopbar.js';
import CreateInvoice from './bankTransactions/purchasesInvoices/createInvoice.js';
import Profile from './profile/profile.js';
import Unauthorised from './auth/unauthorised.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className='App'>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><Sidebar><AdminDashboard /></Sidebar></ProtectedRoute>} />
            <Route path="/bulk-invoicing" element={<ProtectedRoute><Sidebar><BulkInvoicing /></Sidebar></ProtectedRoute>} />
            
            <Route path="/students" element={<ProtectedRoute><Sidebar><Students /></Sidebar></ProtectedRoute>} />
            <Route path="/new-student" element={<ProtectedRoute><Sidebar><NewStudent /></Sidebar></ProtectedRoute>} />
            <Route path="/student-view/:studentId" element={<ProtectedRoute><Sidebar><StudentView /></Sidebar></ProtectedRoute>} />
            <Route path="/student_update/:studentId" element={<ProtectedRoute><Sidebar><StudentUpdate /></Sidebar></ProtectedRoute>} />
            
            <Route path="/levy" element={<ProtectedRoute><Sidebar><Levy /></Sidebar></ProtectedRoute>} />
            <Route path="/newLevyUSD/:studentId" element={<ProtectedRoute><Sidebar><NewLevyUSD /></Sidebar></ProtectedRoute>} />
            <Route path="/newLevyZWG/:studentId" element={<ProtectedRoute><Sidebar><NewLevyZWG /></Sidebar></ProtectedRoute>} />
            
            <Route path="/tuition" element={<ProtectedRoute><Sidebar><Tuition /></Sidebar></ProtectedRoute>} />
            <Route path="/newTuitionUSD/:studentId" element={<ProtectedRoute><Sidebar><NewTuitionUSD /></Sidebar></ProtectedRoute>} />
            <Route path="/newTuitionZWG/:studentId" element={<ProtectedRoute><Sidebar><NewTuitionZWG /></Sidebar></ProtectedRoute>} />
            
            <Route path="/commission" element={<ProtectedRoute><Sidebar><Commission /></Sidebar></ProtectedRoute>} />
            <Route path="/newCommIn" element={<ProtectedRoute><Sidebar><NewCommIn /></Sidebar></ProtectedRoute>} />
            <Route path="/newCommOut" element={<ProtectedRoute><Sidebar><NewCommOut /></Sidebar></ProtectedRoute>} />
            
            <Route path="/txn" element={<ProtectedRoute><Sidebar><TopBar /></Sidebar></ProtectedRoute>} />
            <Route path="/create-invoice" element={<ProtectedRoute><Sidebar><CreateInvoice /></Sidebar></ProtectedRoute>} />
            
            <Route path="/reports" element={<ProtectedRoute><Sidebar><Report /></Sidebar></ProtectedRoute>} />
            <Route path="/invoice/:studentId" element={<ProtectedRoute><Sidebar><Invoice /></Sidebar></ProtectedRoute>} />
            
            <Route path="/financials" element={<ProtectedRoute><Sidebar><Financials /></Sidebar></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><Sidebar><Profile /></Sidebar></ProtectedRoute>} />
            
            <Route path="*" element={<ProtectedRoute><Sidebar><h1> 404 - Not Found</h1></Sidebar></ProtectedRoute>} />
            <Route path="/unauthorised" element={<ProtectedRoute><Sidebar><Unauthorised /></Sidebar></ProtectedRoute>} /> 



          </Routes>
        </div>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

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