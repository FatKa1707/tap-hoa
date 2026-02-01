import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const API_URL = 'http://localhost:5000/api';
const API_URL = 'http://192.168.1.10:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('tap-hoa-current-user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('tap-hoa-current-user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('tap-hoa-current-user');
        }
    }, [currentUser]);

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                const data = await response.json();
                const newUser: User = {
                    id: data.id,
                    name,
                    email,
                    password: '', // Don't store plain text password
                    createdAt: new Date().toISOString()
                };
                setCurrentUser(newUser);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();
                setCurrentUser(user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user: currentUser,
                login,
                register,
                logout,
                isAuthenticated: !!currentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
