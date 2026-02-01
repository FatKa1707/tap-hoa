// User types
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

// Product types
export interface Product {
    id: number;
    name: string;
    sellingPrice: number;
    costPrice: number;
    quantity: number;
    category: string;
    unit: string;
    createdAt: string;
    updatedAt: string;
}

// Transaction types
export type TransactionType = 'buy' | 'sell';

export interface Transaction {
    id: number;
    productId: number;
    productName: string;
    type: TransactionType;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    notes: string;
    createdAt: string;
}

// Dashboard stats
export interface DashboardStats {
    totalProducts: number;
    totalRevenue: number;
    totalExpense: number;
    profit: number;
    lowStockProducts: Product[];
    recentTransactions: Transaction[];
}

// Categories
export const CATEGORIES = [
    'Thực phẩm',
    'Đồ uống',
    'Gia vị',
    'Bánh kẹo',
    'Đồ dùng gia đình',
    'Vệ sinh cá nhân',
    'Khác'
];

// Units
export const UNITS = [
    'Cái',
    'Gói',
    'Hộp',
    'Chai',
    'Lon',
    'Kg',
    'Gram',
    'Lít',
    'Thùng',
    'Bịch'
];
