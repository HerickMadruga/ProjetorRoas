import React, { useState } from 'react';
import styles from './Summary.module.css';

const Summary = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSummary = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.container}>
            <button 
                className={styles.toggleButton} 
                onClick={toggleSummary}
            >
                {isExpanded ? 'Ocultar Sumário' : 'O que é este Projetor?'}
            </button>

            {isExpanded && (
                <div className={styles.content}>
                    <h3>Sobre o Projetor de ROAS Trinity</h3>
                    <p>
                        Esta é uma ferramenta de simulação que ajuda a projetar os resultados de uma campanha de anúncios online. Você preenche os campos com os dados da sua campanha e as métricas do funil para estimar o seu potencial de retorno sobre o investimento (ROAS).
                    </p>
                    
                    <h4>Dados da Campanha e Objetivo</h4>
                    <ul>
                        <li><strong>Preço Médio do Produto:</strong> O valor médio de venda do seu produto ou serviço.</li>
                        <li><strong>Investimento em Anúncios:</strong> O orçamento total que você planeja gastar em suas campanhas.</li>
                        <li><strong>ROAS Desejado:</strong> A sua meta de retorno sobre o investimento. Por exemplo, um ROAS de 3x significa que você deseja faturar R$3 para cada R$1 investido.</li>
                    </ul>

                    <h4>Métricas do Funil de Vendas</h4>
                    <ul>
                        <li><strong>CPM (Custo por Mil Impressões):</strong> O custo para que seu anúncio seja exibido mil vezes. É uma métrica de topo de funil.</li>
                        <li><strong>CTR (Click-Through Rate):</strong> A porcentagem de pessoas que veem seu anúncio e clicam nele.</li>
                        <li><strong>Connect Rate:</strong> A porcentagem de cliques que resultam em uma visita real à sua página de destino (LP).</li>
                        <li><strong>Conv. da LP para Checkout:</strong> A porcentagem de visitantes da sua página que iniciam o processo de compra (checkout).</li>
                        <li><strong>Conv. do Checkout:</strong> A porcentagem de pessoas que iniciam o checkout e finalizam a compra.</li>
                    </ul>

                </div>
            )}
        </div>
    );
};

export default Summary;