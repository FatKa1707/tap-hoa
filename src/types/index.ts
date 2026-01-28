// User types
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    register: (name: string, email: string, password: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
}

// Product types
export interface Product {
    id: string;
    name: string;
    price: number;
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
    id: string;
    productId: string;
    productName: string;
    type: TransactionType;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    note: string;
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
