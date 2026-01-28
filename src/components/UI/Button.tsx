import { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    block?: boolean;
    icon?: boolean;
    children: ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    block = false,
    icon = false,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const classes = [
        'btn',
        `btn-${variant}`,
        size !== 'md' && `btn-${size}`,
        block && 'btn-block',
        icon && 'btn-icon',
        className
    ].filter(Boolean).join(' ');

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}

export default Button;
