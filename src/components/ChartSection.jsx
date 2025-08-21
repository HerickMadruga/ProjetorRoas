// src/components/ChartSection.jsx

import React, { useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import styles from './RoasCalculator.module.css';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
);

const ChartSection = ({ data, isPdfRendering }) => {
    const [isChartVisible, setIsChartVisible] = useState(false);
    const [chartType, setChartType] = useState('bar');

    const renderChart = () => {
        const visitas = Number(data.visitas) || 0;
        const checkouts = Number(data.checkouts) || 0;
        const vendas = Number(data.vendas) || 0;

        if (visitas === 0 && checkouts === 0 && vendas === 0) {
            return <p>Preencha os dados da campanha para visualizar o funil.</p>;
        }
        
        const chartData = {
            labels: ['Visitas na LP', 'Checkouts', 'Vendas'],
            datasets: [{
                label: 'Resultados do Funil',
                data: [visitas, checkouts, vendas],
                backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            }],
        };

        const baseOptions = {
            // AQUI ESTÁ A MUDANÇA CRÍTICA
            animation: isPdfRendering ? false : {},
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Visualização do Funil de Vendas', font: { size: 16 } },
            },
        };
        
        const chartOptions = { ...baseOptions, scales: { y: { beginAtZero: true } } };

        switch (chartType) {
            case 'bar': return <Bar data={chartData} options={chartOptions} />;
            case 'doughnut': return <Doughnut data={chartData} options={baseOptions} />;
            case 'line': return <Line data={chartData} options={chartOptions} />;
            default: return <Bar data={chartData} options={chartOptions} />;
        }
    };

    return (
        <div className={styles.summaryContainer}>
            <button className={styles.toggleButton} onClick={() => setIsChartVisible(!isChartVisible)}>
                {isChartVisible ? 'Ocultar Gráficos' : 'Ver Gráficos'}
            </button>
            {isChartVisible && (
                <>
                    <div className={styles.chartToggle}>
                        <button onClick={() => setChartType('bar')} className={`${styles.chartButton} ${chartType === 'bar' ? styles.active : ''}`}>Barras</button>
                        <button onClick={() => setChartType('doughnut')} className={`${styles.chartButton} ${chartType === 'doughnut' ? styles.active : ''}`}>Pizza</button>
                        <button onClick={() => setChartType('line')} className={`${styles.chartButton} ${chartType === 'line' ? styles.active : ''}`}>Linha</button>
                    </div>
                    <div id="chart-container" style={{ width: '100%', minHeight: '300px', margin: '20px auto', background: 'white', padding: '10px' }}>
                        {renderChart()}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChartSection;