import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../UI';
import './Auth.css';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate
        if (!name || !email || !password || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        // Attempt register
        const success = await register(name, email, password);

        if (success) {
            navigate('/');
        } else {
            setError('Email này đã được sử dụng');
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-icon">🏪</div>
                    <h1>Tiệm Tạp Hoá</h1>
                    <p>Tạo tài khoản để bắt đầu quản lý</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <Input
                        type="text"
                        label="Họ và tên"
                        placeholder="Nhập họ và tên"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />

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
                        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" block disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </Button>
                </form>

                <div className="auth-footer">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
