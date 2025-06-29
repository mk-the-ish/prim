import React from 'react';

const Select = ({ label, name, value, onChange, options = [], required = false, ...props }) => (
  <div className="flex flex-col">
    {label && <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default Select;
