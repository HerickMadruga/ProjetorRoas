import React from 'react';
import styles from './RoasCalculator.module.css';

const ChartTypeSelector = ({ chartType, setChartType }) => {
    return (
        <div className={styles.chartToggle}>
            <button
                onClick={() => setChartType('bar')}
                className={`${styles.chartButton} ${chartType === 'bar' ? styles.active : ''}`}
            >
                Gráfico de Barras
            </button>
            <button
                onClick={() => setChartType('doughnut')}
                className={`${styles.chartButton} ${chartType === 'doughnut' ? styles.active : ''}`}
            >
                Gráfico de Pizza
            </button>
            <button
                onClick={() => setChartType('line')}
                className={`${styles.chartButton} ${chartType === 'line' ? styles.active : ''}`}
            >
                Gráfico de Linha
            </button>
        </div>
    );
};

export default ChartTypeSelector; // ESSA LINHA CORRIGE O ERRO