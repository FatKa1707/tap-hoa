import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Product, Transaction } from '../types';

interface StoreContextType {
    products: Product[];
    transactions: Transaction[];
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'totalAmount'>) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;
    getProductById: (id: number) => Product | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);
// const API_URL = 'http://localhost:5000/api';
const API_URL = 'http://192.168.1.10:5000/api';

export function StoreProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productsRes, transactionsRes] = await Promise.all([
                    fetch(`${API_URL}/products`),
                    fetch(`${API_URL}/transactions`)
                ]);

                if (productsRes.ok && transactionsRes.ok) {
                    const [productsData, transactionsData] = await Promise.all([
                        productsRes.json(),
                        transactionsRes.json()
                    ]);

                    // Parse strings to numbers (MySQL DECIMAL types)
                    const parsedProducts = productsData.map((p: any) => ({
                        ...p,
                        sellingPrice: parseFloat(p.sellingPrice) || 0,
                        costPrice: parseFloat(p.costPrice) || 0,
                        quantity: parseFloat(p.quantity) || 0
                    }));

                    const parsedTransactions = transactionsData.map((t: any) => ({
                        ...t,
                        quantity: parseFloat(t.quantity) || 0,
                        unitPrice: parseFloat(t.unitPrice) || 0,
                        totalAmount: parseFloat(t.totalAmount) || 0
                    }));

                    setProducts(parsedProducts);
                    setTransactions(parsedTransactions);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const data = await response.json();
                const now = new Date().toISOString();
                const newProduct: Product = { ...productData, id: data.id, createdAt: now, updatedAt: now };
                setProducts(prev => [newProduct, ...prev]);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const updateProduct = async (id: number, updates: Partial<Product>) => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                setProducts(prev => prev.map(p =>
                    p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
                ));
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const getProductById = (id: number) => {
        return products.find(p => p.id === id);
    };

    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'totalAmount'>) => {
        try {
            const totalAmount = transactionData.quantity * transactionData.unitPrice;
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...transactionData, totalAmount })
            });

            if (response.ok) {
                const data = await response.json();
                const now = new Date().toISOString();
                const newTransaction = { ...transactionData, id: data.id, totalAmount, createdAt: now };
                setTransactions(prev => [newTransaction as Transaction, ...prev]);

                // Update product quantity in DB and Frontend
                const product = products.find(p => p.id === transactionData.productId);
                if (product) {
                    const quantityChange = transactionData.type === 'buy' ? transactionData.quantity : -transactionData.quantity;
                    await updateProduct(product.id, { quantity: product.quantity + quantityChange });
                }
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const deleteTransaction = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const transaction = transactions.find(t => t.id === id);
                if (transaction) {
                    const product = products.find(p => p.id === transaction.productId);
                    if (product) {
                        const quantityRevert = transaction.type === 'buy' ? -transaction.quantity : transaction.quantity;
                        await updateProduct(product.id, { quantity: product.quantity + quantityRevert });
                    }
                }
                setTransactions(prev => prev.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    if (loading) return null; // Or a better loading spinner

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

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}

export default StoreContext;
