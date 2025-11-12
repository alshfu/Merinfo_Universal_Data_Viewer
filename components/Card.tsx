
import React from 'react';
import { CompanyData, UserInteraction, InteractionStatus } from '../types';
import { useI18n } from '../hooks/useI18n';

const sekFormatter = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });

const StarIcon: React.FC<{isFavorite: boolean}> = ({ isFavorite }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        {isFavorite ? 
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        :
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /> // Placeholder, proper outline is complex
        }
    </svg>
);


const Card: React.FC<{ item: CompanyData; interaction?: UserInteraction; onInteractionChange: (updates: Partial<UserInteraction>) => void; }> = ({ item, interaction, onInteractionChange }) => {
    const { t } = useI18n();
    const { company, contact, financials, industry, tax_info, board } = item;
    
    const isFavorite = interaction?.isFavorite ?? false;
    const currentStatus = interaction?.status ?? 'none';
    const currentComment = interaction?.comment ?? '';

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
    
    const PhoneLink: React.FC<{phone?: string}> = ({phone}) => {
        if (!phone) return <>-</>;
        return <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-primary-600 dark:text-primary-400 hover:underline">{phone}</a>;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400">{company.name || 'No Name'}</h3>
                    <div className="flex items-center gap-2">
                         <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClass}`}>{statusText}</span>
                         <button onClick={() => onInteractionChange({ isFavorite: !isFavorite })} className={`transition-colors ${isFavorite ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600 hover:text-yellow-300'}`}>
                             <StarIcon isFavorite={isFavorite} />
                         </button>
                    </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">{company.org_number}</p>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 flex-grow">
                {/* Left Column */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">{t('company_and_contacts')}</h4>
                    <div className="space-y-2">
                        <DataPoint label={t('form')}>{company.legal_form}</DataPoint>
                        <DataPoint label={t('registration')}>{company.registration_date}</DataPoint>
                        <DataPoint label={t('phone')}><PhoneLink phone={contact.phone} /></DataPoint>
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
                    
                    {industry.activity_description && (
                        <div>
                            <strong className="text-sm font-semibold">{t('activity_description_label')}</strong>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                <p>{industry.activity_description}</p>
                            </div>
                        </div>
                    )}

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
                                    {m.phone && <p className="text-slate-500 dark:text-slate-400"><PhoneLink phone={m.phone} /></p>}
                                </div>
                            )) : <p className="text-slate-400 italic">{t('no_board_data')}</p>}
                         </div>
                    </div>
                </div>
            </div>
             <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-700">
                 <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">{t('interaction')}</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`status-${company.org_number}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('status')}</label>
                        <select 
                            id={`status-${company.org_number}`} 
                            value={currentStatus} 
                            onChange={e => onInteractionChange({ status: e.target.value as InteractionStatus })}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="none">{t('status_none')}</option>
                            <option value="interested">{t('status_interested')}</option>
                            <option value="not_interested">{t('status_not_interested')}</option>
                            <option value="callback">{t('status_callback')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`comment-${company.org_number}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('comment')}</label>
                        <textarea 
                            id={`comment-${company.org_number}`}
                            rows={2}
                            value={currentComment}
                            onChange={e => onInteractionChange({ comment: e.target.value })}
                            placeholder={t('add_comment_placeholder')}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default Card;
