import React from 'react';
import { CompanyData } from '../types';
import { useI18n } from '../hooks/useI18n';

const sekFormatter = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });

const Card: React.FC<{ item: CompanyData }> = ({ item }) => {
    const { t } = useI18n();
    const { company, contact, financials, industry, tax_info, board } = item;

    const statusText = company.status === 'Bolaget är aktivt' ? t('active') : (company.status || t('unknown'));
    const statusClass = company.status === 'Bolaget är aktivt'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    
    const profitClass = (financials.net_profit || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

    const formatBool = (val?: boolean) => {
        if (val === undefined || val === null) return <span className="text-slate-400">-</span>;
        return val ? <span className="text-green-600 dark:text-green-400 font-semibold">{t('yes')}</span> : <span className="text-red-600 dark:text-red-400">{t('no')}</span>;
    };
    
    const DataPoint: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
        <div className={`flex justify-between items-baseline ${className}`}>
            <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
            <span className="text-slate-800 dark:text-slate-200 text-sm font-medium text-right">{children || '-'}</span>
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400">{company.name || 'No Name'}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClass}`}>{statusText}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">{company.org_number}</p>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Left Column */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">{t('company_and_contacts')}</h4>
                    <div className="space-y-2">
                        <DataPoint label={t('form')}>{company.legal_form}</DataPoint>
                        <DataPoint label={t('registration')}>{company.registration_date}</DataPoint>
                        <DataPoint label={t('phone')}>{contact.phone}</DataPoint>
                        <DataPoint label={t('address')}>{contact.address}</DataPoint>
                        <DataPoint label={t('city_county')}>{`${contact.city}, ${contact.county}`}</DataPoint>
                    </div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider pt-2">{t('financials')} ({financials.period || 'N/A'})</h4>
                    <div className="space-y-2">
                        <DataPoint label={t('revenue')}>{financials.revenue != null ? sekFormatter.format(financials.revenue) : '-'}</DataPoint>
                        <DataPoint label={t('profit_before_tax')}>{financials.profit_after_financial_items != null ? sekFormatter.format(financials.profit_after_financial_items) : '-'}</DataPoint>
                        <DataPoint label={t('net_profit')}><span className={profitClass}>{financials.net_profit != null ? sekFormatter.format(financials.net_profit) : '-'}</span></DataPoint>
                        <DataPoint label={t('total_assets')}>{financials.total_assets != null ? sekFormatter.format(financials.total_assets) : '-'}</DataPoint>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">{t('industry_and_board')}</h4>
                    <div>
                        <strong className="text-sm font-semibold">{t('sni_code', { code: industry.sni_code || '-' })}</strong>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 space-y-1">
                            {(industry.sni_description || '').split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
                        </div>
                    </div>
                    <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2">{t('categories')}</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {industry.categories?.length > 0
                                ? industry.categories.map(cat => <span key={cat} className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{cat}</span>)
                                : <span className="text-sm text-slate-400">-</span>
                            }
                        </div>
                    </div>
                    <div className="pt-2">
                         <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2">{t('board')}</h4>
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
                </div>
            </div>
             <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-3 text-center text-sm">
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
    );
};

export default Card;