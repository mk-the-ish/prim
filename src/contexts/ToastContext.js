import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTheme } from './ThemeContext';

// Create the Toast Context
const ToastContext = createContext();

// Custom hook to use the toast functionality
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast component with forwardRef
const Toast = React.forwardRef(({ message, type, id, onDismiss }, ref) => {
    const { currentTheme } = useTheme();
    let bgColor = '';
    let textColor = currentTheme.text.contrastText || '#FFFFFF'; // Default to white if not specified

    switch (type) {
        case 'success':
            bgColor = currentTheme.success.main;
            break;
        case 'error':
            bgColor = currentTheme.error.main;
            break;
        case 'info':
            bgColor = currentTheme.primary.main; // Using primary color for info
            break;
        case 'warning':
            bgColor = currentTheme.warning.main;
            break;
        default:
            bgColor = currentTheme.background.secondary; // Fallback to a background shade
            textColor = currentTheme.text.primary; // Fallback to primary text color
    }

    return (
        <div
            ref={ref}
            className={`relative p-4 mb-3 rounded-lg shadow-lg font-semibold flex items-center justify-between max-w-sm w-full`}
            style={{ backgroundColor: bgColor, color: textColor }} // Apply dynamic styles
            role="alert"
        >
            <span>{message}</span>
            <button
                onClick={() => onDismiss(id)}
                className="ml-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
                style={{ color: textColor }} // Ensure dismiss icon color matches text
                aria-label="Dismiss toast"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
});

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const TOAST_TIMEOUT = 5000; // 5 seconds duration for toasts
    const toastRefs = useRef({});

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

        setTimeout(() => {
            dismissToast(id);
        }, TOAST_TIMEOUT);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        delete toastRefs.current[id];
    }, []);

    const value = { addToast, dismissToast, clearToasts: () => setToasts([]) };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
                <TransitionGroup>
                    {toasts.map((toast) => {
                        if (!toastRefs.current[toast.id]) {
                            toastRefs.current[toast.id] = React.createRef();
                        }
                        return (
                            <CSSTransition
                                key={toast.id}
                                nodeRef={toastRefs.current[toast.id]}
                                timeout={300}
                                classNames={{
                                    enter: 'animate-slideIn',
                                    exit: 'animate-fadeOut'
                                }}
                            >
                                <Toast
                                    ref={toastRefs.current[toast.id]}
                                    id={toast.id}
                                    message={toast.message}
                                    type={toast.type}
                                    onDismiss={dismissToast}
                                />
                            </CSSTransition>
                        );
                    })}
                </TransitionGroup>
            </div>
        </ToastContext.Provider>
    );
};