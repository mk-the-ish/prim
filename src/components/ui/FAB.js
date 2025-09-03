import React, { useState } from 'react';

/**
 * Floating Action Button (FAB) component
 * @param {object} props
 * @param {React.ReactNode[]} props.actions - Array of action buttons (usually Button components)
 * @param {string} [props.position] - Position of the FAB (default: bottom right)
 * @param {string} [props.icon] - Main FAB icon (default: '+')
 */
const FAB = ({ actions = [], position = 'bottom-10 right-10', icon = '+', className = '' }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`fixed z-50 ${position} flex flex-col items-end gap-3 ${className}`} style={{ pointerEvents: 'none' }}>
      {open && actions.map((action, idx) => (
        <div key={idx} style={{ pointerEvents: 'auto' }}>
          {action}
        </div>
      ))}
      <button
        type="button"
        aria-label="Open actions"
        className={`w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-3xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 ${open ? 'rotate-45' : ''}`}
        style={{ pointerEvents: 'auto' }}
        onClick={() => setOpen(o => !o)}
      >
        {icon}
      </button>
    </div>
  );
};

export default FAB;
