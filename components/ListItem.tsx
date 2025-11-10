import React, { useState } from 'react';
import { CompanyData } from '../types';
import { useI18n } from '../hooks/useI18n';

// Compact formatter for the main row
const compactSekFormatter = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0, notation: 'compact' });

// Full formatter for the expanded view
const fullSekFormatter = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });

const ChevronDownIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


// Reusable data point component for the expanded view, similar to Card.tsx
const DataPoint: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
    <div className={`flex justify-between items-baseline text-sm ${className}`}>
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium text-right text-wrap break-all">{children || '-'}</span>
    </div>
);


const ExpandedContent: React.FC<{ item: CompanyData }> = ({ item }) => {
    const { t } = useI18n();
    const { company, contact, financials, industry, tax_info, board } = item;
    
    const profitClass = (financials.net_profit || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

    const formatBool = (val?: boolean) => {
        if (val === undefined || val === null) return <span className="text-slate-400">-</span>;
        return val ? <span className="text-green-600 dark:text-green-400 font-semibold">{t('yes')}</span> : <span className="text-red-600 dark:text-red-400">{t('no')}</span>;
    };

    return (
        <div className="p-4 sm:p-5 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/20">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                {/* Column 1: Company & Financials */}
                <div className="space-y-6">
                    <div>
                        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">{t('company_and_contacts')}</h4>
                        <div className="space-y-2">
                            <DataPoint label={t('form')}>{company.legal_form}</DataPoint>
                            <DataPoint label={t('phone')}>{contact.phone}</DataPoint>
                            <DataPoint label={t('address')}>{contact.address}</DataPoint>
                            <DataPoint label={t('city_county')}>{`${contact.city}, ${contact.county}`}</DataPoint>
                        </div>
                    </div>
                     <div>
                        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">{t('financials')} ({financials.period || 'N/A'})</h4>
                        <div className="space-y-2">
                            <DataPoint label={t('revenue')}>{financials.revenue != null ? fullSekFormatter.format(financials.revenue) : '-'}</DataPoint>
                            <DataPoint label={t('profit_before_tax')}>{financials.profit_after_financial_items != null ? fullSekFormatter.format(financials.profit_after_financial_items) : '-'}</DataPoint>
                            <DataPoint label={t('net_profit')}><span className={profitClass}>{financials.net_profit != null ? fullSekFormatter.format(financials.net_profit) : '-'}</span></DataPoint>
                            <DataPoint label={t('total_assets')}>{financials.total_assets != null ? fullSekFormatter.format(financials.total_assets) : '-'}</DataPoint>
                        </div>
                    </div>
                </div>

                {/* Column 2: Industry & Categories */}
                <div className="space-y-6">
                    <div>
                        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">{t('industry_and_board')}</h4>
                        <strong className="text-sm font-semibold">{t('sni_code', { code: industry.sni_code || '-' })}</strong>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 space-y-1">
                            {(industry.sni_description || '').split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">{t('categories')}</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {industry.categories?.length > 0
                                ? industry.categories.map(cat => <span key={cat} className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{cat}</span>)
                                : <span className="text-sm text-slate-400">-</span>
                            }
                        </div>
                    </div>
                </div>

                {/* Column 3: Board & Taxes */}
                <div className="space-y-6">
                     <div>
                         <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">{t('board')}</h4>
                         <div className="space-y-3 text-sm">
                            {board?.length > 0 ? board.map((m, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</p>
                                    <p className="text-slate-500 dark:text-slate-400">{m.role} - {m.age} {t('years')}</p>
                                    {m.phone && <p className="text-slate-500 dark:text-slate-400">{m.phone}</p>}
                                </div>
                            )) : <p className="text-slate-400 italic">{t('no_board_data')}</p>}
                         </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">{t('taxes')}</h4>
                        <div className="grid grid-cols-3 text-center">
                            <div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block">F-skatt</span>
                                {formatBool(tax_info.f_skatt)}
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block">VAT</span>
                                {formatBool(tax_info.vat_registered)}
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block">{t('employer')}</span>
                                {formatBool(tax_info.employer_registered)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ListItem: React.FC<{ item: CompanyData }> = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { t } = useI18n();
    const { company, contact, financials } = item;
    
    const profitClass = (financials.net_profit || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const statusText = company.status === 'Bolaget är aktivt' ? t('active') : (company.status || t('unknown'));
    const statusClass = company.status === 'Bolaget är aktivt'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

    return (
        <div className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
            <div 
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-4 gap-y-2 text-sm items-center">
                    
                    {/* Name and Status */}
                    <div className="sm:col-span-4">
                        <p className="font-bold text-primary-700 dark:text-primary-400 truncate">{company.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}`}>{statusText}</span>
                            <p className="text-slate-500 dark:text-slate-400 font-mono text-xs">{company.org_number}</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="sm:col-span-2">
                        <p className="text-slate-800 dark:text-slate-200">{contact.city}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{contact.county}</p>
                    </div>
                    
                    {/* Revenue */}
                    <div className="sm:col-span-2">
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{financials.revenue != null ? compactSekFormatter.format(financials.revenue) : '-'}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{t('revenue')}</p>
                    </div>
                    
                    {/* Net Profit */}
                    <div className="sm:col-span-2">
                        <p className={`font-medium ${profitClass}`}>{financials.net_profit != null ? compactSekFormatter.format(financials.net_profit) : '-'}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{t('net_profit')}</p>
                    </div>
                    
                    {/* Registration Date & Expander */}
                    <div className="sm:col-span-2 flex justify-between items-center">
                        <div>
                            <p className="text-slate-800 dark:text-slate-200">{company.registration_date}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">{t('registration')}</p>
                        </div>
                         <div className={`transform text-slate-400 ${isExpanded ? 'rotate-180' : ''}`}>
                             <ChevronDownIcon />
                         </div>
                    </div>
                </div>
            </div>
            {isExpanded && <ExpandedContent item={item} />}
        </div>
    );
};

export default ListItem;
