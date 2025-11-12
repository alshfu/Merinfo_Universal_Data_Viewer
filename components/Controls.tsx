
import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { Filters, InteractionStatus } from '../types';
import { sortOptions } from '../constants';
import MultiSelect from './MultiSelect';
import ViewToggle from './ViewToggle';
import { ViewMode } from '../App';

interface ControlsProps {
    datasets: { name: string; download_url: string }[];
    selectedDataset: string;
    onDatasetSelect: (url: string) => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortMethod: string;
    onSortChange: (value:string) => void;
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
}

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


const Controls: React.FC<ControlsProps> = ({
    datasets, selectedDataset, onDatasetSelect,
    searchTerm, onSearchChange,
    sortMethod, onSortChange,
    filters, onFiltersChange,
    onResetFilters,
    sniOptions, categoryOptions,
    statusMsg, recordCount, isDisabled,
    viewMode, onViewModeChange,
}) => {
    const { t } = useI18n();
    const [showFilters, setShowFilters] = useState(false);

    const statusFilterOptions: { value: InteractionStatus; label: string }[] = [
        { value: 'none', label: t('status_none') },
        { value: 'interested', label: t('status_interested') },
        { value: 'not_interested', label: t('status_not_interested') },
        { value: 'callback', label: t('status_callback') },
    ];

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
                    <label htmlFor="datasetSelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('label_select_dataset')}</label>
                    <select
                        id="datasetSelect"
                        value={selectedDataset}
                        onChange={e => onDatasetSelect(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="" >{t('select_placeholder')}</option>
                        {datasets.map(d => (
                            <option key={d.name} value={d.download_url}>
                                {d.name}
                            </option>
                        ))}
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

            <div className="mt-4 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex flex-wrap gap-4 items-center">
                    <button onClick={() => setShowFilters(!showFilters)} disabled={isDisabled} className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 disabled:text-slate-400 disabled:cursor-not-allowed">
                        <FilterIcon />
                        {t('advanced_filters')}
                    </button>
                    
                    <label htmlFor="favoritesToggle" className={`flex items-center cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                id="favoritesToggle" 
                                className="sr-only" 
                                checked={filters.showFavoritesOnly}
                                onChange={(e) => handleFilterChange('showFavoritesOnly', e.target.checked)}
                                disabled={isDisabled}
                            />
                            <div className="block bg-slate-200 dark:bg-slate-700 w-10 h-6 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.showFavoritesOnly ? 'translate-x-full bg-primary-500' : ''}`}></div>
                        </div>
                        <div className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <StarIcon />
                            {t('show_favorites_only')}
                        </div>
                    </label>
                </div>
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
                        {/* Tax Filters */}
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('f_skatt_filter')}</label>
                             <select value={filters.f_skatt} onChange={e => handleFilterChange('f_skatt', e.target.value as any)} className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                <option value="any">{t('any')}</option>
                                <option value="yes">{t('yes')}</option>
                                <option value="no">{t('no')}</option>
                            </select>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('vat_filter')}</label>
                             <select value={filters.vat_registered} onChange={e => handleFilterChange('vat_registered', e.target.value as any)} className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                <option value="any">{t('any')}</option>
                                <option value="yes">{t('yes')}</option>
                                <option value="no">{t('no')}</option>
                            </select>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('employer_filter')}</label>
                             <select value={filters.employer_registered} onChange={e => handleFilterChange('employer_registered', e.target.value as any)} className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                <option value="any">{t('any')}</option>
                                <option value="yes">{t('yes')}</option>
                                <option value="no">{t('no')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('filter_by_status')}</label>
                            <MultiSelect 
                                options={statusFilterOptions.map(o => o.label)} 
                                selected={filters.status.map(s => statusFilterOptions.find(o => o.value === s)?.label).filter(Boolean) as string[]}
                                onChange={selectedLabels => {
                                    const selectedValues = selectedLabels.map(label =>
                                        statusFilterOptions.find(o => o.label === label)?.value
                                    ).filter((v): v is InteractionStatus => !!v);
                                    handleFilterChange('status', selectedValues);
                                }}
                                placeholder={t('select_placeholder')}
                            />
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

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between items-center text-sm text-slate-500 dark:text-slate-400 gap-2 sm:gap-0">
                <span>{statusMsg}</span>
                <span>{t('records')}: {recordCount}</span>
            </div>
        </div>
    );
};

export default Controls;
