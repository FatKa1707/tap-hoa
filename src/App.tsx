import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Login, Register } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Transactions } from './components/Transactions';
import { ReactNode } from 'react';

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

// Public route wrapper (redirect to home if already logged in)
function PublicRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute>
                    <Register />
                </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="transactions" element={<Transactions />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <StoreProvider>
                    <AppRoutes />
                </StoreProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
