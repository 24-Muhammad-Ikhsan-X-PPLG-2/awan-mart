export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

export const formatNumber = (value: number) =>
    new Intl.NumberFormat('id-ID').format(value);

export const formatDate = (
    value: string | null,
    options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    },
) =>
    value
        ? new Intl.DateTimeFormat('id-ID', options).format(new Date(value))
        : '—';

export const getInitials = (value: string) =>
    value
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toLocaleUpperCase('id-ID'))
        .join('') || 'AM';
