import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useLocalStorage<User[]>('tap-hoa-users', []);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('tap-hoa-current-user', null);

    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const register = (name: string, email: string, password: string): boolean => {
        // Check if email already exists
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return false;
        }

        const newUser: User = {
            id: generateId(),
            name,
            email: email.toLowerCase(),
            password,
            createdAt: new Date().toISOString()
        };

        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        return true;
    };

    const login = (email: string, password: string): boolean => {
        const user = users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
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
