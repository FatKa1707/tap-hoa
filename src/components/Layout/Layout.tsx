import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../UI';
import './Layout.css';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const navItems = [
        { path: '/', icon: '📊', label: 'Tổng quan' },
        { path: '/products', icon: '📦', label: 'Hàng hoá' },
        { path: '/transactions', icon: '💰', label: 'Giao dịch' },
    ];

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-logo">🏪</span>
                    <span className="sidebar-title">Tiệm Tạp Hoá</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <div className="nav-section-title">Menu chính</div>
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                                end={item.path === '/'}
                            >
                                <span className="nav-link-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <Button variant="ghost" block onClick={handleLogout}>
                        🚪 Đăng xuất
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <div className="main-content">
                <header className="navbar">
                    <div className="navbar-left">
                        <button
                            className="menu-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            ☰
                        </button>
                    </div>

                    <div className="navbar-right">
                        <div className="navbar-user">
                            <div className="navbar-avatar">
                                {user ? getInitials(user.name) : '?'}
                            </div>
                            <span className="navbar-username">{user?.name}</span>
                        </div>
                    </div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 99
                    }}
                />
            )}
        </div>
    );
}

export default Layout;
