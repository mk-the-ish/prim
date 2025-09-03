import React from 'react';
import Button from './button';
import { useTheme } from '../../contexts/ThemeContext';

const FormInput = ({ label, ...props }) => {
    const { currentTheme } = useTheme();
    return (
        <div>
            <label className="block text-sm font-medium mb-1 text-left">{label}</label>
            <input
                {...props}
                className="w-full rounded-lg p-2 focus:outline-none focus:ring-2"
                style={{
                    border: `1px solid ${currentTheme.divider || '#d1d5db'}`,
                    color: currentTheme.text?.primary,
                    background: currentTheme.background?.paper
                }}
            />
        </div>
    );
};

const FormSelect = ({ label, options, ...props }) => {
    const { currentTheme } = useTheme();
    return (
        <div>
            <label className="block text-sm font-medium mb-1 text-left">{label}</label>
            <select
                {...props}
                className="w-full rounded-lg p-2 focus:outline-none focus:ring-2"
                style={{
                    border: `1px solid ${currentTheme.divider || '#d1d5db'}`,
                    color: currentTheme.text?.primary,
                    background: currentTheme.background?.paper
                }}
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
};

const Form = ({ onSubmit, loading, children, title }) => {
    const { currentTheme } = useTheme();
    return (
        <div
            className="max-w-lg mx-auto p-2"
            style={{
                color: currentTheme.text?.primary
            }}
        >
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