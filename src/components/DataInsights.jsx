// src/components/DataInsights.jsx

import React from 'react';
import styles from './RoasCalculator.module.css';

// O componente agora recebe os insights prontos via props
const DataInsights = ({ insights }) => {
    return (
        <div className={styles.insightsContainer}>
            <h2>Análise e Insights</h2>
            <div className={styles.insightsList}>
                {/* Garante que 'insights' existe antes de tentar mapear */}
                {insights && insights.map((insight, index) => (
                    <div key={index} className={`${styles.insight} ${styles[insight.type]}`}>
                        <p>{insight.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataInsights;