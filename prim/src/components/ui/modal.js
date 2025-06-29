import React, { useEffect } from 'react';

/**
 * Modal component
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.className] - Additional classes for modal content
 * @param {string} [props.overlayClassName] - Additional classes for overlay
 */
const Modal = ({ open, onClose, children, className = '', overlayClassName = '' }) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity ${overlayClassName}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-lg w-full relative ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
