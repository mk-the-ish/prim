// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Moved themes object here from App.js
export const themes = {
    light: {
        primary: {
            main: '#1E40AF', // Blue-800
            light: '#3B82F6', // Blue-500
            dark: '#1E3A8A', // Blue-900
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#4F46E5', // Indigo-600
            light: '#6366F1', // Indigo-500
            dark: '#4338CA', // Indigo-700
            contrastText: '#FFFFFF'
        },
        background: {
            default: '#F3F4F6', // Gray-100
            paper: '#FFFFFF',
            secondary: '#F9FAFB' // Gray-50
        },
        text: {
            primary: '#111827', // Gray-900
            secondary: '#4B5563', // Gray-600
            disabled: '#9CA3AF' // Gray-400
        },
        error: {
            main: '#DC2626', // Red-600
            light: '#EF4444', // Red-500
            dark: '#B91C1C' // Red-700
        },
        success: {
            main: '#059669', // Green-600
            light: '#10B981', // Green-500
            dark: '#047857' // Green-700
        },
        warning: {
            main: '#D97706', // Yellow-600
            light: '#F59E0B', // Yellow-500
            dark: '#B45309' // Yellow-700
        },
        divider: '#E5E7EB' // Gray-200
    },
    dark: {
        primary: {
            main: '#3B82F6', // Blue-500
            light: '#60A5FA', // Blue-400
            dark: '#2563EB', // Blue-600
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#6366F1', // Indigo-500
            light: '#818CF8', // Indigo-400
            dark: '#4F46E5', // Indigo-600
            contrastText: '#FFFFFF'
        },
        background: {
            default: '#111827', // Gray-900
            paper: '#1F2937', // Gray-800
            secondary: '#374151' // Gray-700
        },
        text: {
            primary: '#F9FAFB', // Gray-50
            secondary: '#E5E7EB', // Gray-200
            disabled: '#9CA3AF' // Gray-400
        },
        error: {
            main: '#EF4444', // Red-500
            light: '#F87171', // Red-400
            dark: '#DC2626' // Red-600
        },
        success: {
            main: '#10B981', // Green-500
            light: '#34D399', // Green-400
            dark: '#059669' // Green-600
        },
        warning: {
            main: '#F59E0B', // Yellow-500
            light: '#FBBF24', // Yellow-400
            dark: '#D97706' // Yellow-600
        },
        divider: '#374151' // Gray-700
    }
};

const ThemeContext = createContext({
    themeName: 'light',
    currentTheme: themes.light,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState(() => {
        const storedTheme = localStorage.getItem('appTheme');
        // Check if storedTheme is a valid theme name
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
            return storedTheme;
        }
        // Otherwise, fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove previous theme class and add the current one
        root.classList.remove('light', 'dark');
        root.classList.add(themeName);

        // Store the current theme preference (not the override flag)
        localStorage.setItem('appTheme', themeName);
    }, [themeName]);

    // Listen to system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only update if user hasn't manually overridden the theme
            // We check for 'appThemeUserOverride' to see if a manual toggle has occurred
            if (!localStorage.getItem('appThemeUserOverride')) {
                const newSystemTheme = e.matches ? 'dark' : 'light';
                setThemeName(newSystemTheme);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setThemeName(prevThemeName => {
            const newThemeName = prevThemeName === 'light' ? 'dark' : 'light';
            // When user manually toggles, set an override flag and the new theme
            localStorage.setItem('appThemeUserOverride', 'true');
            localStorage.setItem('appTheme', newThemeName); // Also update the current theme
            return newThemeName;
        });
    };

    // Memoize currentTheme to avoid unnecessary recalculations
    const currentTheme = useMemo(() => themes[themeName], [themeName]);

    return (
        <ThemeContext.Provider value={{ themeName, currentTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
