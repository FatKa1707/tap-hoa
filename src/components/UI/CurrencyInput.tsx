import { useState, useEffect, ChangeEvent } from 'react';
import './Input.css';

interface CurrencyInputProps {
    label?: string;
    error?: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

// Format number with dot separators (Vietnamese style)
function formatWithDots(num: string): string {
    // Remove all non-digit characters
    const digits = num.replace(/\D/g, '');
    if (!digits) return '';

    // Format with dots
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Remove dots to get raw number
function removeDots(formatted: string): string {
    return formatted.replace(/\./g, '');
}

export function CurrencyInput({
    label,
    error,
    required,
    value,
    onChange,
    placeholder = 'VD: 25.000',
    disabled = false
}: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState('');

    // Update display when external value changes
    useEffect(() => {
        if (value) {
            setDisplayValue(formatWithDots(value));
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow only digits and dots
        const cleaned = inputValue.replace(/[^\d.]/g, '');

        // Get raw number (without dots)
        const rawNumber = removeDots(cleaned);

        // Format for display
        const formatted = formatWithDots(rawNumber);
        setDisplayValue(formatted);

        // Send raw number to parent
        onChange(rawNumber);
    };

    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <input
                type="text"
                inputMode="numeric"
                className={`input ${error ? 'input-error' : ''}`}
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
}

export default CurrencyInput;
