import React from 'react';
import Modal from './modal';

/**
 * FormModal - reusable modal for forms
 * @param {boolean} open - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Form content
 * @param {string} [widthClass] - Optional width class (e.g. 'max-w-xl')
 * @param {React.ReactNode} [searchBar] - Optional search bar element
 * @param {React.ReactNode} [actionButton] - Optional action button (e.g. Add Student)
 */
const FormModal = ({ open, onClose, title, children, widthClass = 'max-w-xl', searchBar, actionButton }) => (
  <Modal open={open} onClose={onClose}>
    <div className={`w-full ${widthClass}`}>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <h2 className="text-xl font-bold whitespace-nowrap mr-4">{title}</h2>
          {searchBar && <div className="flex-1 min-w-0">{searchBar}</div>}
          {actionButton && <div className="ml-2">{actionButton}</div>}
        </div>
        <button
          className="text-gray-400 hover:text-primary text-2xl font-bold focus:outline-none ml-2"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  </Modal>
);

export default FormModal;
