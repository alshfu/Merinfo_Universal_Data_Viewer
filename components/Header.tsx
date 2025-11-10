import React from 'react';
import { useI18n } from '../hooks/useI18n';
import ThemeToggle from './ThemeToggle';

const LanguageButton: React.FC<{ targetLang: 'ru' | 'sv' }> = ({ targetLang }) => {
    const { lang, setLanguage } = useI18n();
    const isActive = lang === targetLang;

    return (
        <button
            onClick={() => setLanguage(targetLang)}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                isActive 
                ? 'bg-primary-600 text-white' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
            {targetLang.toUpperCase()}
        </button>
    );
};

const Header: React.FC = () => {
    const { t } = useI18n();

    return (
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {t('main_title')}
                </h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                        <LanguageButton targetLang="ru" />
                        <LanguageButton targetLang="sv" />
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;