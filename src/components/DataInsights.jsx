import React from 'react';
import styles from './RoasCalculator.module.css';

const DataInsights = ({ data }) => {
    const insights = [];

    // Definição de métricas de mercado para análise
    const benchmarks = {
        cpc: 2.0, // R$
        ctr: 2.0, // %
        connectRate: 85, // %
        convLP: 2.0, // %
        convCheckout: 80, // %
        cpaRatio: 0.5 // CPA deve ser no máximo 50% do preço do produto
    };

    // Análise e geração de insights
    if (data.cpc > benchmarks.cpc * 1.5) {
        insights.push({
            type: 'warning',
            message: `Seu CPC (${data.cpc.toFixed(2)} R$) está alto. Considere melhorar a segmentação ou o anúncio para reduzir o custo por clique.`
        });
    }

    if (data.ctr < benchmarks.ctr) {
        insights.push({
            type: 'warning',
            message: `Seu CTR (${data.ctr.toFixed(2)}%) está abaixo da média de mercado. O anúncio pode não ser atraente para o público.`
        });
    }

    if (data.connectRate < benchmarks.connectRate) {
        insights.push({
            type: 'warning',
            message: `O Connect Rate (${data.connectRate.toFixed(2)}%) está baixo. Verifique se sua página está carregando rapidamente.`
        });
    }

    if (data.cpa > data.rMeta * benchmarks.cpaRatio) {
        insights.push({
            type: 'warning',
            message: `Seu CPA (${data.cpa.toFixed(2)} R$) está alto em relação à sua meta de ROAS. Isso pode dificultar atingir seu objetivo.`
        });
    }
    
    if (data.roas > data.rMeta) {
        insights.push({
            type: 'success',
            message: `Seu ROAS estimado (${data.roas.toFixed(2)}x) está superando sua meta! Parabéns!`
        });
    }

    if (data.roas > 0 && data.roas < data.rMeta) {
        insights.push({
            type: 'info',
            message: `O ROAS estimado (${data.roas.toFixed(2)}x) está abaixo da sua meta. Analise as métricas do funil para otimizar.`
        });
    }

    if (insights.length === 0) {
        insights.push({
            type: 'info',
            message: 'Nenhum ponto crítico encontrado. Seus dados de funil estão saudáveis!'
        });
    }

    return (
        <div className={styles.insightsContainer}>
            <h2>Análise e Insights</h2>
            <div className={styles.insightsList}>
                {insights.map((insight, index) => (
                    <div key={index} className={`${styles.insight} ${styles[insight.type]}`}>
                        <p>{insight.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataInsights;