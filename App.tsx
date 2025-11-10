
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CompanyData, Filters } from './types';
import Header from './components/Header';
import Controls from './components/Controls';
import CardGrid from './components/CardGrid';
import { useI18n } from './hooks/useI18n';

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
    const [selectedDataset, setSelectedDataset] = useState<string>('');

    const { t } = useI18n();
    
    useEffect(() => {
        setStatusMsg(t('status_waiting'));
    }, [t]);
    
    useEffect(() => {
        localStorage.setItem('merinfo_view_mode', viewMode);
    }, [viewMode]);

    const initialFilters: Filters = {
        revenue: {},
        profit_after_financial_items: {},
        net_profit: {},
        total_assets: {},
        companyPhone: 'any',
        boardPhone: 'any',
        sni: [],
        categories: [],
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
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        resetForNewFile();
        setSelectedDataset('');

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            loadDataFromString(text);
        };
        reader.onerror = () => {
            setStatusMsg(t('status_error_read'));
            setIsLoading(false);
        };
        reader.readAsText(file);
    };

    const handleDefaultFileSelect = async (fileName: string) => {
        if (!fileName) {
            setSelectedDataset('');
            return;
        }
        
        resetForNewFile();
        setSelectedDataset(fileName);
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        try {
            const response = await fetch(fileName);
            if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
            const text = await response.text();
            loadDataFromString(text);
        } catch (error) {
            console.error('Error fetching default file:', error);
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

            if (filters.sni.length > 0) {
                const itemSni = item.industry?.sni_description?.split('\n').map(d => d.trim()) || [];
                if (!itemSni.some(desc => filters.sni.includes(desc))) return false;
            }

            if (filters.categories.length > 0) {
                const itemCats = item.industry?.categories || [];
                if (!itemCats.some(cat => filters.categories.includes(cat))) return false;
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

    }, [allData, searchTerm, sortMethod, filters]);
    
    const handleResetFilters = useCallback(() => {
      setFilters(initialFilters);
    }, []);

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Controls
                    onFileChange={handleFileChange}
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
                    selectedDataset={selectedDataset}
                    onDefaultFileSelect={handleDefaultFileSelect}
                />
                <CardGrid data={displayedData} isLoading={isLoading} viewMode={viewMode} />
            </main>
        </div>
    );
};

export default App;
