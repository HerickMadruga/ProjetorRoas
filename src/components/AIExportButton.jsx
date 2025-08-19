import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AIExportButton.module.css";

const AIExportButton = ({ data, insights }) => {
    const navigate = useNavigate();
    const [selectedAI, setSelectedAI] = useState('gemini');

    const handleExportToAI = () => {
        if (!data || Object.keys(data).length === 0) {
            alert("Por favor, preencha os dados da calculadora antes de exportar.");
            return;
        }
        
        const promptMessage = `
Olá, preciso de uma análise de funil de vendas e sugestões de otimização com base nos seguintes dados:

**Dados da Campanha:**
- Investimento: R$ ${data.investimento.toFixed(2)}
- Preço Médio do Produto: R$ ${data.precoMedio.toFixed(2)}
- ROAS Desejado (Meta): ${data.roasDesejado.toFixed(2)}x
- ROAS Atual Projetado: ${data.roas.toFixed(2)}x
- Taxa de Cliques (CTR): ${data.ctr.toFixed(2)}%
- Visitas na LP (Connect Rate): ${data.connectRate.toFixed(2)}%
- Conversão da LP: ${data.convLP.toFixed(2)}%
- Conversão do Checkout: ${data.convCheckout.toFixed(2)}%

**Análise Crítica do Funil:**
${insights}

Com base nesses dados, por favor, me ajude com:
1. Uma análise detalhada do meu funil de vendas.
2. Sugestões de otimizações para as métricas mencionadas na Análise Crítica do Funil.
3. Uma projeção de como pequenas melhorias no funil podem impactar o ROAS.
`;

        navigate("/ia", { state: { prompt: promptMessage, selectedAI: selectedAI } });
    };

    return (
        <div className={styles["export-controls"]}>
            <p>Análise de Dados com IA:</p>
            <select
                className={styles['ai-selector']}
                value={selectedAI}
                onChange={(e) => setSelectedAI(e.target.value)}
            >
                <option value="gemini">Gemini</option>
                <option value="chatgpt">ChatGPT</option>
            </select>
            <button
                className={styles["export-button"]}
                onClick={handleExportToAI}
            >
                Gerar Análise
            </button>
        </div>
    );
};

export default AIExportButton;