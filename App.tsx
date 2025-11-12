
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CompanyData, Filters, UserInteraction } from './types';
import Header from './components/Header';
import Controls from './components/Controls';
import CardGrid from './components/CardGrid';
import { useI18n } from './hooks/useI18n';
import { githubDatasets } from './constants';

export type ViewMode = 'grid' | 'list';

const App: React.FC = () => {
    const [allData, setAllData] = useState<CompanyData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMsg, setStatusMsg] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortMethod, setSortMethod] = useState<string>('name-asc');
    const [sniOptions, setSniOptions] = useState<string[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        return (localStorage.getItem('merinfo_view_mode') as ViewMode) || 'grid';
    });
    const [userInteractions, setUserInteractions] = useState<Record<string, UserInteraction>>({});
    const [datasets] = useState(githubDatasets);
    const [selectedDataset, setSelectedDataset] = useState<string>('');


    const { t } = useI18n();
    
    useEffect(() => {
        setStatusMsg(t('status_waiting'));
        try {
            const savedInteractions = localStorage.getItem('merinfo_interactions');
            if (savedInteractions) {
                setUserInteractions(JSON.parse(savedInteractions));
            }
        } catch (error) {
            console.error("Failed to load user interactions from localStorage", error);
        }
    }, [t]);
    
    useEffect(() => {
        localStorage.setItem('merinfo_view_mode', viewMode);
    }, [viewMode]);
    
    useEffect(() => {
        try {
            localStorage.setItem('merinfo_interactions', JSON.stringify(userInteractions));
        } catch (error) {
            console.error("Failed to save user interactions to localStorage", error);
        }
    }, [userInteractions]);

    const initialFilters: Filters = {
        revenue: {},
        profit_after_financial_items: {},
        net_profit: {},
        total_assets: {},
        companyPhone: 'any',
        boardPhone: 'any',
        sni: [],
        categories: [],
        status: [],
        f_skatt: 'any',
        vat_registered: 'any',
        employer_registered: 'any',
        showFavoritesOnly: false,
    };

    const [filters, setFilters] = useState<Filters>(initialFilters);

    const loadDataFromString = (text: string) => {
        let parsedData: CompanyData[] = [];
        let success = false;

        try {
            const json = JSON.parse(text);
            if (Array.isArray(json)) {
                parsedData = json.filter(item => item && item.company && item.company.name);
            } else if (json && json.company && json.company.name) {
                parsedData = [json];
            }
            success = parsedData.length > 0;
        } catch (e1) {
            const lines = text.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed && parsed.company && parsed.company.name) {
                            parsedData.push(parsed);
                        }
                    } catch (e2) { /* ignore broken lines */ }
                }
            });
            success = parsedData.length > 0;
        }
        
        if(success) {
            setAllData(parsedData);
            setStatusMsg(t('status_loaded'));
            
            const sniSet = new Set<string>();
            const categorySet = new Set<string>();
            parsedData.forEach(item => {
                item.industry?.sni_description?.split('\n').forEach(desc => desc.trim() && sniSet.add(desc.trim()));
                item.industry?.categories?.forEach(cat => cat.trim() && categorySet.add(cat.trim()));
            });
            setSniOptions(Array.from(sniSet).sort());
            setCategoryOptions(Array.from(categorySet).sort());

        } else {
             setStatusMsg(t('status_error_format'));
        }
        setIsLoading(false);
    };

    const resetForNewFile = () => {
        setIsLoading(true);
        setStatusMsg(t('status_reading'));
        setAllData([]);
        setFilters(initialFilters);
        setSearchTerm('');
        setSniOptions([]);
        setCategoryOptions([]);
    };
    
    const handleDatasetSelect = async (url: string) => {
        setSelectedDataset(url);
        if (!url) {
            setAllData([]);
            setFilters(initialFilters);
            setSearchTerm('');
            setStatusMsg(t('status_waiting'));
            setSniOptions([]);
            setCategoryOptions([]);
            return;
        }

        resetForNewFile();
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            loadDataFromString(text);
        } catch (e) {
            console.error("Failed to load dataset:", e);
            setStatusMsg(t('status_error_read'));
            setIsLoading(false);
        }
    };


    const displayedData = useMemo(() => {
        let filtered = [...allData];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.company?.name?.toLowerCase().includes(term) ||
                item.company?.org_number?.includes(term) ||
                item.contact?.city?.toLowerCase().includes(term)
            );
        }

        // Advanced filters
        filtered = filtered.filter(item => {
            const f = item.financials;
            if ((filters.revenue.min != null && (f?.revenue ?? -Infinity) < filters.revenue.min) || (filters.revenue.max != null && (f?.revenue ?? Infinity) > filters.revenue.max)) return false;
            if ((filters.profit_after_financial_items.min != null && (f?.profit_after_financial_items ?? -Infinity) < filters.profit_after_financial_items.min) || (filters.profit_after_financial_items.max != null && (f?.profit_after_financial_items ?? Infinity) > filters.profit_after_financial_items.max)) return false;
            if ((filters.net_profit.min != null && (f?.net_profit ?? -Infinity) < filters.net_profit.min) || (filters.net_profit.max != null && (f?.net_profit ?? Infinity) > filters.net_profit.max)) return false;
            if ((filters.total_assets.min != null && (f?.total_assets ?? -Infinity) < filters.total_assets.min) || (filters.total_assets.max != null && (f?.total_assets ?? Infinity) > filters.total_assets.max)) return false;
            
            const hasCompanyPhone = !!item.contact?.phone;
            if (filters.companyPhone === 'yes' && !hasCompanyPhone) return false;
            if (filters.companyPhone === 'no' && hasCompanyPhone) return false;

            const hasBoardPhone = item.board?.some(member => !!member.phone);
            if (filters.boardPhone === 'yes' && !hasBoardPhone) return false;
            if (filters.boardPhone === 'no' && hasBoardPhone) return false;

            const taxInfo = item.tax_info;
            if (filters.f_skatt === 'yes' && !taxInfo?.f_skatt) return false;
            if (filters.f_skatt === 'no' && taxInfo?.f_skatt) return false;

            if (filters.vat_registered === 'yes' && !taxInfo?.vat_registered) return false;
            if (filters.vat_registered === 'no' && taxInfo?.vat_registered) return false;

            if (filters.employer_registered === 'yes' && !taxInfo?.employer_registered) return false;
            if (filters.employer_registered === 'no' && taxInfo?.employer_registered) return false;

            if (filters.sni.length > 0) {
                const itemSni = item.industry?.sni_description?.split('\n').map(d => d.trim()) || [];
                if (!itemSni.some(desc => filters.sni.includes(desc))) return false;
            }

            if (filters.categories.length > 0) {
                const itemCats = item.industry?.categories || [];
                if (!itemCats.some(cat => filters.categories.includes(cat))) return false;
            }
            
            if (filters.status.length > 0) {
                const interaction = userInteractions[item.company.org_number];
                const currentStatus = interaction?.status ?? 'none';
                if (!filters.status.includes(currentStatus)) {
                    return false;
                }
            }
            
            if (filters.showFavoritesOnly) {
                if (!userInteractions[item.company.org_number]?.isFavorite) {
                    return false;
                }
            }

            return true;
        });


        // Sorting
        const [key, direction] = sortMethod.split('-');
        return filtered.sort((a, b) => {
             let valA: any, valB: any;
                switch (key) {
                    case 'name':
                        valA = a.company?.name?.toLowerCase() || '';
                        valB = b.company?.name?.toLowerCase() || '';
                        break;
                    case 'revenue':
                    case 'profit_after_financial_items':
                    case 'net_profit':
                    case 'total_assets':
                        valA = a.financials?.[key as keyof typeof a.financials] ?? -Infinity;
                        valB = b.financials?.[key as keyof typeof b.financials] ?? -Infinity;
                        break;
                    case 'date':
                        valA = new Date(a.company?.registration_date || 0).getTime();
                        valB = new Date(b.company?.registration_date || 0).getTime();
                        break;
                    default: return 0;
                }
                if (valA < valB) return direction === 'asc' ? -1 : 1;
                if (valA > valB) return direction === 'asc' ? 1 : -1;
                return 0;
        });

    }, [allData, searchTerm, sortMethod, filters, userInteractions]);
    
    const handleResetFilters = useCallback(() => {
      setFilters(initialFilters);
    }, []);

    const handleInteractionChange = useCallback((orgNumber: string, updates: Partial<UserInteraction>) => {
        setUserInteractions(prev => ({
            ...prev,
            [orgNumber]: {
                ...(prev[orgNumber] || { status: 'none', comment: '', isFavorite: false }),
                ...updates,
            }
        }));
    }, []);

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Controls
                    datasets={datasets}
                    selectedDataset={selectedDataset}
                    onDatasetSelect={handleDatasetSelect}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sortMethod={sortMethod}
                    onSortChange={setSortMethod}
                    filters={filters}
                    onFiltersChange={setFilters}
                    onResetFilters={handleResetFilters}
                    sniOptions={sniOptions}
                    categoryOptions={categoryOptions}
                    statusMsg={statusMsg}
                    recordCount={displayedData.length}
                    isDisabled={allData.length === 0 && !isLoading}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
                <CardGrid 
                    data={displayedData} 
                    isLoading={isLoading} 
                    viewMode={viewMode}
                    userInteractions={userInteractions}
                    onInteractionChange={handleInteractionChange}
                />
            </main>
        </div>
    );
};

export default App;
