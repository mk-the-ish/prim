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
import { Fees } from './studentPayments/levy/fees.js';
import StudentView from './studentPayments/students/StudentView.js';
import NewCommIn from './cashTransactions/commission/commIN.js';
import NewCommOut from './cashTransactions/commission/commOUT.js';
import Commission from './cashTransactions/commission/commission.js';
import Financials from './layouts/financialsTopbar.js';
import Report from './layouts/report.js';
import Invoice from './studentPayments/reports/invoice.js';
import BulkInvoicing from './dashboard/bulkInvoicing.js';
import TopBar from './layouts/TransactionsTopbar.js';
import CreateInvoice from './bankTransactions/purchasesInvoices/createInvoice.js';
import UpdateInvoice from './bankTransactions/purchasesInvoices/updateInvoice.js';
import Profile from './profile/profile.js';
import Unauthorised from './auth/unauthorised.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppThemeProvider } from '../contexts/ThemeContext.js'
import { ToastProvider } from '../contexts/ToastContext.js';
import AdminDashboard from './dashboard/AdminDashboard';
import TeacherDashboard from './dashboard/TeacherDashboard';
import ParentDashboard from './dashboard/ParentDashboard';
import BursarDashboard from './dashboard/BursarDashboard';
import { useUserRole } from './../contexts/useUserRole.js'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { user, role, isLoading } = useUserRole();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen dark:bg-gray-900 text-white">Loading application...</div>;
  }

  if (!user) {
    return <Login />;
  }

  switch (role) {
    case 'administrator': return <AdminDashboard />;
    case 'teacher': return <TeacherDashboard />;
    case 'parent': return <ParentDashboard />;
    case 'bursar': return <BursarDashboard />;
    default: return <div>Unknown role</div>;
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['administrator', 'bursar', 'teacher', 'parent']}><Sidebar><AppContent /></Sidebar></ProtectedRoute>} />
      <Route path="/bulk-invoicing" element={<ProtectedRoute allowedRoles={['bursar']}><Sidebar><BulkInvoicing /></Sidebar></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={['administrator', 'bursar', 'teacher']}><Sidebar><Students /></Sidebar></ProtectedRoute>} />
      <Route path="/student-view/:studentId" element={<ProtectedRoute allowedRoles={['parent', 'bursar', 'teacher']}><Sidebar><StudentView /></Sidebar></ProtectedRoute>} />
      <Route path="/parent-dashboard/:studentId?" element={<ProtectedRoute allowedRoles={['parent']}><Sidebar><ParentDashboard /></Sidebar></ProtectedRoute>} />
      <Route path="/fees" element={<ProtectedRoute allowedRoles={['administrator', 'bursar']}><Sidebar><Fees /></Sidebar></ProtectedRoute>} />
      <Route path="/commission" element={<ProtectedRoute allowedRoles={['bursar']}><Sidebar><Commission /></Sidebar></ProtectedRoute>} />
      <Route path="/newCommIn" element={<ProtectedRoute allowedRoles={['bursar']}><Sidebar><NewCommIn /></Sidebar></ProtectedRoute>} />
      <Route path="/newCommOut" element={<ProtectedRoute allowedRoles={['bursar']}><Sidebar><NewCommOut /></Sidebar></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute allowedRoles={['administrator', 'bursar']}><Sidebar><TopBar /></Sidebar></ProtectedRoute>} />
      <Route path="/create-invoice" element={<ProtectedRoute allowedRoles={['administrator', 'bursar']}><Sidebar><CreateInvoice /></Sidebar></ProtectedRoute>} />
      <Route path="/update-invoice/:id" element={<ProtectedRoute allowedRoles={['administrator', 'bursar']}><Sidebar><UpdateInvoice /></Sidebar></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={['administrator', 'bursar']}><Sidebar><Report /></Sidebar></ProtectedRoute>} />
      <Route path="/invoice/:studentId" element={<ProtectedRoute allowedRoles={['teacher', 'bursar', 'parent']}><Sidebar><Invoice /></Sidebar></ProtectedRoute>} />
      <Route path="/financials" element={<ProtectedRoute allowedRoles={['administrator', 'bursar']}><Sidebar><Financials /></Sidebar></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['administrator', 'bursar', 'teacher', 'parent']}><Sidebar><Profile /></Sidebar></ProtectedRoute>} />
      <Route path="*" element={<ProtectedRoute allowedRoles={['administrator', 'bursar', 'teacher', 'parent']}><Sidebar><h1> 404 - Not Found</h1></Sidebar></ProtectedRoute>} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <AppRoutes />
              <ReactQueryDevtools initialIsOpen={false} />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default AppWrapper;