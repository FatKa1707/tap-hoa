import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../UI';
import './Auth.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            setLoading(false);
            return;
        }

        // Attempt login
        const success = login(email, password);

        if (success) {
            navigate('/');
        } else {
            setError('Email hoặc mật khẩu không đúng');
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-icon">🏪</div>
                    <h1>Tiệm Tạp Hoá</h1>
                    <p>Đăng nhập để quản lý cửa hàng của bạn</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <Input
                        type="email"
                        label="Email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" block disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </form>

                <div className="auth-footer">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
