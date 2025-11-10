import React from 'react';
import { CompanyData } from '../types';
import Card from './Card';
import ListItem from './ListItem';
import { useI18n } from '../hooks/useI18n';
import { ViewMode } from '../App';

interface CardGridProps {
    data: CompanyData[];
    isLoading: boolean;
    viewMode: ViewMode;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400">{useI18n().t('status_analyzing')}</p>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="text-center py-20 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">{useI18n().t('no_data')}</p>
    </div>
);

const CardGrid: React.FC<CardGridProps> = ({ data, isLoading, viewMode }) => {
    const { t } = useI18n();
    if (isLoading) return <LoadingSpinner />;
    if (data.length === 0) return <EmptyState />;

    const renderContent = () => {
        const itemsToRender = data.slice(0, 500);

        if (viewMode === 'grid') {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {itemsToRender.map((item, index) => (
                        <Card key={item.company.org_number || index} item={item} />
                    ))}
                </div>
            );
        }

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
                <div>
                    {itemsToRender.map((item, index) => (
                        <ListItem key={item.company.org_number || index} item={item} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            {data.length > 500 && (
                <div className="mb-4 p-3 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                    {t('showing_first_500')}
                </div>
            )}
            {renderContent()}
        </div>
    );
};

export default CardGrid;