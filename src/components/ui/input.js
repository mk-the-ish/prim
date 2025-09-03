import React from 'react';

const Input = ({ label, name, value, onChange, type = 'text', required = false, ...props }) => (
  <div className="flex flex-col">
    {label && <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      {...props}
    />
  </div>
);

export default Input;
