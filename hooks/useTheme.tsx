import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('theme');
        if (storedPrefs === 'light' || storedPrefs === 'dark') {
            return storedPrefs;
        }
    }
    return 'system';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        root.classList.remove(isDark ? 'light' : 'dark');
        root.classList.add(isDark ? 'dark' : 'light');

        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
             if (theme === 'system') {
                 const root = window.document.documentElement;
                 const isDark = mediaQuery.matches;
                 root.classList.remove(isDark ? 'light' : 'dark');
                 root.classList.add(isDark ? 'dark' : 'light');
             }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
