
export interface Address {
    street: string;
    postal_code: string;
    city: string;
}

export interface BoardMember {
    name: string;
    role: string;
    age: number;
    phone?: string;
    address: Address;
}

export interface Company {
    name: string;
    org_number: string;
    legal_form: string;
    status: string;
    registration_date: string;
}

export interface Contact {
    phone?: string;
    address: string;
    city: string;
    county: string;
}

export interface Financials {
    period: string;
    revenue?: number;
    profit_after_financial_items?: number;
    net_profit?: number;
    total_assets?: number;
}

export interface Industry {
    activity_description: string;
    sni_code: string;
    sni_description: string;
    categories: string[];
}

export interface TaxInfo {
    f_skatt: boolean;
    vat_registered: boolean;
    employer_registered: boolean;
}

export interface CompanyData {
    company: Company;
    contact: Contact;
    financials: Financials;
    industry: Industry;
    tax_info: TaxInfo;
    board: BoardMember[];
}

export type InteractionStatus = 'none' | 'interested' | 'not_interested' | 'callback';

export interface UserInteraction {
    status: InteractionStatus;
    comment: string;
    isFavorite: boolean;
}

export interface Filters {
    revenue: { min?: number; max?: number };
    profit_after_financial_items: { min?: number; max?: number };
    net_profit: { min?: number; max?: number };
    total_assets: { min?: number; max?: number };
    companyPhone: 'any' | 'yes' | 'no';
    boardPhone: 'any' | 'yes' | 'no';
    sni: string[];
    categories: string[];
    status: InteractionStatus[];
    f_skatt: 'any' | 'yes' | 'no';
    vat_registered: 'any' | 'yes' | 'no';
    employer_registered: 'any' | 'yes' | 'no';
    showFavoritesOnly: boolean;
}