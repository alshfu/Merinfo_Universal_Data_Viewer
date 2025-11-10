
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { translations } from '../constants';

type Language = 'ru' | 'sv';

interface I18nContextType {
    lang: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['ru'], replacements?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Language>(() => {
        const storedLang = localStorage.getItem('merinfo_lang');
        return (storedLang === 'ru' || storedLang === 'sv') ? storedLang : 'ru';
    });

    const setLanguage = useCallback((newLang: Language) => {
        setLang(newLang);
        localStorage.setItem('merinfo_lang', newLang);
        document.documentElement.lang = newLang;
    }, []);

    const t = useCallback((key: keyof typeof translations['ru'], replacements?: Record<string, string>) => {
        let translation = translations[lang][key] || translations['ru'][key];
        if (replacements) {
            Object.keys(replacements).forEach(rKey => {
                translation = translation.replace(`{${rKey}}`, replacements[rKey]);
            });
        }
        return translation;
    }, [lang]);

    const value = useMemo(() => ({ lang, setLanguage, t }), [lang, setLanguage, t]);

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};
