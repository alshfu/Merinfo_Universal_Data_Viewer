
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder: string;
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ChevronDownIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useI18n();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={ref}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex flex-wrap items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm cursor-pointer"
            >
                {selected.length === 0 && <span className="text-slate-400">{placeholder}</span>}
                {selected.map(item => (
                    <span key={item} className="flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleOption(item); }}
                            className="text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
                        >
                            <XIcon />
                        </button>
                    </span>
                ))}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder={t('label_search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto p-1">
                        {filteredOptions.length > 0 ? filteredOptions.map(option => (
                            <li
                                key={option}
                                className="px-2 py-1.5 text-sm text-slate-700 dark:text-slate-300 rounded-md hover:bg-primary-50 dark:hover:bg-slate-700 cursor-pointer flex items-center"
                                onClick={() => toggleOption(option)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    readOnly
                                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 mr-2"
                                />
                                {option}
                            </li>
                        )) : <li className="px-2 py-1.5 text-sm text-slate-500">{t('no_results_found')}</li>}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
