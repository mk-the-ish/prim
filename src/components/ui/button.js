import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({
  onClick,
  disabled,
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const { currentTheme } = useTheme();

  // Fetch colors from theme context
  const themeColors = currentTheme[variant] || currentTheme.primary;
  const baseStyles = 'px-3 py-1 rounded transition-colors font-medium focus:outline-none';

  // Compose styles based on theme and state
  const style = {
    backgroundColor: disabled
      ? currentTheme.text.disabled
      : themeColors.main,
    color: disabled
      ? currentTheme.text.secondary
      : themeColors.contrastText,
    border: variant === 'secondary' ? `1px solid ${themeColors.main}` : 'none',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;