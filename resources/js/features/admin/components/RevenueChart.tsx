import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { DashboardRange } from '../types';

type Props = {
    data: Array<{
        date: string;
        revenue: number;
    }>;
    range: DashboardRange;
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
);

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

const formatShortCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
        return `Rp ${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
    }

    if (value >= 1_000_000) {
        return `Rp ${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;
    }

    if (value >= 1_000) {
        return `Rp ${(value / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} rb`;
    }

    return formatCurrency(value);
};

const formatDate = (date: string, range: DashboardRange) => {
    const [year, month, day] = date.split('-').map(Number);
    const value =
        range === '12m'
            ? new Date(year, month - 1, 1)
            : new Date(year, month - 1, day);

    return new Intl.DateTimeFormat(
        'id-ID',
        range === '12m'
            ? { month: 'short', year: '2-digit' }
            : { day: 'numeric', month: 'short' },
    ).format(value);
};

const RevenueChart = ({ data, range }: Props) => {
    const hasRevenue = data.some((point) => point.revenue > 0);
    const chartData = {
        labels: data.map((point) => formatDate(point.date, range)),
        datasets: [
            {
                data: data.map((point) => point.revenue),
                borderColor: '#203452',
                backgroundColor: 'rgba(32, 52, 82, 0.07)',
                borderWidth: 2.5,
                pointRadius: data.length <= 7 ? 2.5 : 0,
                pointHoverRadius: 4,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#203452',
                pointBorderWidth: 2,
                fill: true,
                tension: 0.35,
            },
        ],
    };
    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#203452',
                titleFont: {
                    family: 'Inter, sans-serif',
                    size: 11,
                    weight: 500,
                },
                bodyFont: {
                    family: 'Inter, sans-serif',
                    size: 12,
                    weight: 600,
                },
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => formatCurrency(context.parsed.y ?? 0),
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#98A2B3',
                    font: {
                        family: 'Inter, sans-serif',
                        size: 10,
                    },
                    maxTicksLimit: 5,
                    maxRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
                border: {
                    display: false,
                },
                grid: {
                    color: '#E8EBF0',
                    tickLength: 0,
                    tickBorderDash: [3, 5],
                },
                ticks: {
                    color: '#98A2B3',
                    font: {
                        family: 'Inter, sans-serif',
                        size: 10,
                    },
                    maxTicksLimit: 3,
                    padding: 8,
                    callback: (value) => formatShortCurrency(Number(value)),
                },
            },
        },
    };

    return (
        <div className="relative h-52">
            {!hasRevenue && (
                <p className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-[#98A2B3]">
                    Belum ada pembayaran berhasil pada periode ini.
                </p>
            )}
            <Line
                data={chartData}
                options={options}
                role="img"
                aria-label="Grafik tren pendapatan berdasarkan pembayaran berhasil"
            />
        </div>
    );
};

export default RevenueChart;
