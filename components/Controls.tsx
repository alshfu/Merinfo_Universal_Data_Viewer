
import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { Filters } from '../types';
import { sortOptions, defaultDatasets } from '../constants';
import MultiSelect from './MultiSelect';
import ViewToggle from './ViewToggle';
import { ViewMode } from '../App';

interface ControlsProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortMethod: string;
    onSortChange: (value: string) => void;
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    onResetFilters: () => void;
    sniOptions: string[];
    categoryOptions: string[];
    statusMsg: string;
    recordCount: number;
    isDisabled: boolean;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    selectedDataset: string;
    onDefaultFileSelect: (fileName: string) => void;
}

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
);

const Controls: React.FC<ControlsProps> = ({
    onFileChange,
    searchTerm, onSearchChange,
    sortMethod, onSortChange,
    filters, onFiltersChange,
    onResetFilters,
    sniOptions, categoryOptions,
    statusMsg, recordCount, isDisabled,
    viewMode, onViewModeChange,
    selectedDataset, onDefaultFileSelect
}) => {
    const { t } = useI18n();
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = <K extends keyof Filters, V extends Filters[K]>(key: K, value: V) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const handleRangeFilterChange = (key: 'revenue' | 'profit_after_financial_items' | 'net_profit' | 'total_assets', type: 'min' | 'max', value: string) => {
        const numValue = value === '' ? undefined : parseFloat(value);
        handleFilterChange(key, { ...filters[key], [type]: numValue });
    };

    const financialFilterConfig = [
        { labelKey: 'revenue', filterKey: 'revenue' },
        { labelKey: 'profit_before_tax', filterKey: 'profit_after_financial_items' },
        { labelKey: 'net_profit', filterKey: 'net_profit' },
        { labelKey: 'total_assets', filterKey: 'total_assets' },
    ] as const;

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <div>
                    <label htmlFor="fileInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('label_select_file')}</label>
                    <input type="file" id="fileInput" accept=".json,.jsonl,.txt" onChange={onFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600 transition-colors" />
                    <select
                        id="defaultDatasetSelect"
                        value={selectedDataset}
                        onChange={e => onDefaultFileSelect(e.target.value)}
                        aria-label={t('dataset_placeholder')}
                        className="mt-2 w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">{t('dataset_placeholder')}</option>
                        {defaultDatasets.map(opt => <option key={opt.value} value={opt.value}>{t(opt.key as any)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="searchInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('label_search')}</label>
                    <input type="text" id="searchInput" value={searchTerm} onChange={e => onSearchChange(e.target.value)} placeholder={t('placeholder_search')} disabled={isDisabled} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed" />
                </div>
                <div>
                    <label htmlFor="sortSelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('label_sort')}</label>
                    <select id="sortSelect" value={sortMethod} onChange={e => onSortChange(e.target.value)} disabled={isDisabled} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed">
                        {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.key as any)}</option>)}
                    </select>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <button onClick={() => setShowFilters(!showFilters)} disabled={isDisabled} className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 disabled:text-slate-400 disabled:cursor-not-allowed">
                    <FilterIcon />
                    {t('advanced_filters')}
                </button>
                 <ViewToggle
                    mode={viewMode}
                    onModeChange={onViewModeChange}
                    isDisabled={isDisabled}
                />
            </div>

            {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Financial Filters */}
                        {financialFilterConfig.map(({ labelKey, filterKey }) => {
                            return (
                                <div key={filterKey}>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t(labelKey)}</label>
                                    <div className="flex space-x-2">
                                        <input type="number" placeholder={t('min')} value={filters[filterKey].min ?? ''} onChange={e => handleRangeFilterChange(filterKey, 'min', e.target.value)} className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                                        <input type="number" placeholder={t('max')} value={filters[filterKey].max ?? ''} onChange={e => handleRangeFilterChange(filterKey, 'max', e.target.value)} className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                                    </div>
                                </div>
                            );
                        })}
                        {/* Select Filters */}
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('company_phone')}</label>
                             <select value={filters.companyPhone} onChange={e => handleFilterChange('companyPhone', e.target.value as any)} className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                <option value="any">{t('any')}</option>
                                <option value="yes">{t('has_phone')}</option>
                                <option value="no">{t('no_phone')}</option>
                            </select>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('board_phone')}</label>
                             <select value={filters.boardPhone} onChange={e => handleFilterChange('boardPhone', e.target.value as any)} className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                <option value="any">{t('any')}</option>
                                <option value="yes">{t('has_phone')}</option>
                                <option value="no">{t('no_phone')}</option>
                            </select>
                        </div>
                        {/* MultiSelect Filters */}
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('sni_description')}</label>
                             <MultiSelect options={sniOptions} selected={filters.sni} onChange={selected => handleFilterChange('sni', selected)} placeholder={t('select_placeholder')} />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('categories_filter')}</label>
                             <MultiSelect options={categoryOptions} selected={filters.categories} onChange={selected => handleFilterChange('categories', selected)} placeholder={t('select_placeholder')} />
                        </div>
                    </div>
                     <div className="mt-4 flex justify-end">
                        <button onClick={onResetFilters} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">{t('clear_filters')}</button>
                    </div>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                <span>{statusMsg}</span>
                <span>{t('records')}: {recordCount}</span>
            </div>
        </div>
    );
};

export default Controls;
