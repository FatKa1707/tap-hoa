import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product, Transaction, TransactionType } from '../types';

interface StoreContextType {
    products: Product[];
    transactions: Transaction[];
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'totalAmount'>) => void;
    deleteTransaction: (id: string) => void;
    getProductById: (id: string) => Product | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useLocalStorage<Product[]>('tap-hoa-products', []);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('tap-hoa-transactions', []);

    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newProduct: Product = {
            ...productData,
            id: generateId(),
            createdAt: now,
            updatedAt: now
        };
        setProducts([...products, newProduct]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(products.map(p =>
            p.id === id
                ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                : p
        ));
    };

    const deleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const getProductById = (id: string) => {
        return products.find(p => p.id === id);
    };

    const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'totalAmount'>) => {
        const totalAmount = transactionData.quantity * transactionData.unitPrice;

        const newTransaction: Transaction = {
            ...transactionData,
            id: generateId(),
            totalAmount,
            createdAt: new Date().toISOString()
        };

        // Update product quantity
        const product = products.find(p => p.id === transactionData.productId);
        if (product) {
            const quantityChange = transactionData.type === 'buy'
                ? transactionData.quantity
                : -transactionData.quantity;

            updateProduct(product.id, {
                quantity: product.quantity + quantityChange
            });
        }

        setTransactions([newTransaction, ...transactions]);
    };

    const deleteTransaction = (id: string) => {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            // Revert the quantity change
            const product = products.find(p => p.id === transaction.productId);
            if (product) {
                const quantityRevert = transaction.type === 'buy'
                    ? -transaction.quantity
                    : transaction.quantity;

                updateProduct(product.id, {
                    quantity: product.quantity + quantityRevert
                });
            }
        }
        setTransactions(transactions.filter(t => t.id !== id));
    };

    return (
        <StoreContext.Provider
            value={{
                products,
                transactions,
                addProduct,
                updateProduct,
                deleteProduct,
                addTransaction,
                deleteTransaction,
                getProductById
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore(): StoreContextType {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}

export default StoreContext;
