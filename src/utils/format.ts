// Format currency with dots as thousand separators and VNĐ unit
export function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
}

// Format date in Vietnamese
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format full datetime
export function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
