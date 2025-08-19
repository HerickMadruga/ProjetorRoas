import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Adicionado para o gráfico de pizza
    PointElement, // Adicionado para o gráfico de linha
    LineElement, // Adicionado para o gráfico de linha
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const FunnelChart = ({ data, chartType }) => {
    const chartData = {
        labels: ['Visitas na LP', 'Checkouts', 'Vendas'],
        datasets: [
            {
                label: 'Resultados do Funil',
                data: [data.visitas, data.checkouts, data.vendas],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                },
            },
            title: {
                display: true,
                text: 'Visualização do Funil de Vendas',
                font: {
                    size: 16,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('pt-BR').format(context.parsed.y);
                        }
                        return label;
                    }
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Eventos',
                    font: {
                        size: 12,
                    },
                },
                ticks: {
                    precision: 0,
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Etapa do Funil',
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };

    // Renderiza o gráfico correto com base no tipo
    const renderChart = () => {
        if (data.visitas === 0 && data.checkouts === 0 && data.vendas === 0) {
            return <p>Preencha os dados da campanha para visualizar o funil.</p>;
        }

        switch (chartType) {
            case 'bar':
                return <Bar data={chartData} options={options} />;
            case 'doughnut':
                const doughnutOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: {
                            display: true,
                            text: 'Proporção de Eventos no Funil',
                            font: { size: 16 }
                        },
                        tooltip: options.plugins.tooltip,
                    },
                };
                return <Doughnut data={chartData} options={doughnutOptions} />;
            case 'line':
                const lineOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: {
                            display: true,
                            text: 'Queda de Eventos no Funil',
                            font: { size: 16 }
                        },
                        tooltip: options.plugins.tooltip,
                    },
                    scales: options.scales,
                };
                return <Line data={chartData} options={lineOptions} />;
            default:
                return <Bar data={chartData} options={options} />;
        }
    };

    return (
        <div style={{ width: '100%', minHeight: '300px', margin: '20px auto' }}>
            {renderChart()}
        </div>
    );
};

export default FunnelChart;