import { useState, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    required?: boolean;
}

export function Input({ label, error, required, className = '', type, ...props }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className="input-wrapper">
                <input
                    type={inputType}
                    className={`input ${error ? 'input-error' : ''} ${isPassword ? 'input-with-toggle' : ''} ${className}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                )}
            </div>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    required?: boolean;
}

export function Textarea({ label, error, required, className = '', ...props }: TextareaProps) {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <textarea
                className={`input textarea ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
}

export function Select({ label, error, required, className = '', children, ...props }: SelectProps) {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <select
                className={`input select ${error ? 'input-error' : ''} ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
}

export default Input;
