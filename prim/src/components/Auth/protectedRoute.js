import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useUserRole } from '../../contexts/useUserRole';
import { useToast } from '../../contexts/ToastContext';

const dashboardRoutes = {
  administrator: '/dashboard',
  teacher: '/dashboard',
  parent: '/dashboard',
  bursar: '/dashboard',
};

const validRoles = ['administrator', 'teacher', 'parent', 'bursar'];

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();
    const { role, isLoading } = useUserRole();
    const { addToast } = useToast();
    const location = useLocation();
    const [redirect, setRedirect] = React.useState(null);
    const [toastMsg, setToastMsg] = React.useState(null);

    React.useEffect(() => {
        if (!loading && !isLoading) {
            if (!user) {
                setToastMsg('You must be signed in to access this area.');
                setRedirect(<Navigate to="/login" state={{ from: location }} replace />);
            } else if (!validRoles.includes(role)) {
                setToastMsg('You do not have access to this area.');
                setRedirect(<Navigate to="/login" replace />);
            } else if (allowedRoles && !allowedRoles.includes(role)) {
                setToastMsg('You do not have access to this area. Redirected to your dashboard.');
                setRedirect(<Navigate to={dashboardRoutes[role] || '/login'} replace />);
            } else {
                setToastMsg(null);
                setRedirect(null);
            }
        }
    }, [user, role, loading, isLoading, allowedRoles, location]);

    React.useEffect(() => {
        if (toastMsg) {
            addToast(toastMsg, 'warning');
        }
    }, [toastMsg, addToast]);

    if (loading || isLoading) {
        return <div>Loading...</div>;
    }

    if (redirect) {
        return redirect;
    }

    return children;
};

export default ProtectedRoute;