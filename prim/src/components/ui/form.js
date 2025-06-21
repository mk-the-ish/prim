import React from 'react';
import Button from './button';

const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-left">{label}</label>
        <input
            {...props}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

const FormSelect = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-left">{label}</label>
        <select
            {...props}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Select {label}</option>
            {options.map(option => (
                <option key={option.value || option} value={option.value || option}>
                    {option.label || option}
                </option>
            ))}
        </select>
    </div>
);

const Form = ({ onSubmit, loading, children, title }) => {
    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            {title && <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>}
            <form onSubmit={onSubmit} className="space-y-4">
                {children}
                <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="w-full py-2"
                >
                    {loading ? 'Processing...' : 'Submit'}
                </Button>
            </form>
        </div>
    );
};

Form.Input = FormInput;
Form.Select = FormSelect;

export default Form;
