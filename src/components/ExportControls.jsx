// src/components/ExportControls.jsx

import React, { useMemo } from 'react'; // Importe o useMemo
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { CSVLink } from 'react-csv';

import styles from './ExportControls.module.css';
import logo from "/logo-trinity.png";

const ExportControls = ({ data, insights, productName, isAutoMode, setPdfRendering }) => {

    const handleExportPDF = async () => {
        if (!data || data.investimento === 0) { alert("Por favor, preencha os dados da campanha antes de exportar."); return; }
        const chartCanvas = document.getElementById('chart-container')?.querySelector('canvas');
        if (!chartCanvas) { alert("Por favor, clique em 'Ver Gráficos' para exibi-los antes de exportar o PDF."); return; }

        setPdfRendering(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            const canvas = await html2canvas(chartCanvas, { scale: 2 });
            const chartImageData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;

            // --- PÁGINA 1: PÁGINA DE ROSTO ---
            pdf.addImage(logo, 'PNG', margin, 15, 70, 18);
            pdf.setFontSize(26).text("Relatório de Planejamento de Campanha", pageWidth / 2, 90, { align: 'center' });
            pdf.setFontSize(14).text(`Meta de ROAS: ${data.roasDesejado.toFixed(2)}x`, pageWidth / 2, 105, { align: 'center' });
            pdf.line(margin, 120, pageWidth - margin, 120);
            pdf.setFontSize(12).text(`Produto: ${productName || 'Não informado'}`, margin, 130);
            pdf.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, margin, 137);
            pdf.line(margin, 250, pageWidth - margin, 250);
            pdf.setFontSize(9).setTextColor(150).text("Relatório gerado pela Ferramenta Projetor de ROAS Trinity", pageWidth / 2, 260, { align: 'center' });

            // --- PÁGINA 2: RESUMO E DADOS ---
            pdf.addPage();
            pdf.setFontSize(18).text("Resumo Executivo e Dados da Simulação", margin, 25);
            let introText = isAutoMode
                ? `Este documento apresenta um plano de metas de performance para atingir o ROAS desejado de ${data.roasDesejado.toFixed(2)}x. As métricas do funil foram calculadas para servir como um guia claro dos KPIs que a campanha precisa alcançar.`
                : `Este documento detalha a projeção de resultados com base nas métricas fornecidas para a campanha do produto "${productName || 'Produto/Serviço'}".`;
            pdf.setFontSize(11).setTextColor(100).text(pdf.splitTextToSize(introText, pageWidth - margin * 2), margin, 35);

            autoTable(pdf, {
                startY: isAutoMode ? 75 : 55,
                head: [[isAutoMode ? 'Métrica-Alvo da Campanha' : 'Métrica da Campanha', isAutoMode ? 'Valor-Meta' : 'Valor Fornecido']],
                body: [
                    ['Investimento (R$)', data.investimento.toFixed(2)], ['Preço do Produto (R$)', data.precoMedio.toFixed(2)],
                    ['ROAS Desejado (x)', `${data.roasDesejado.toFixed(2)}x`], ['CPM (R$)', data.cpm.toFixed(2)],
                    ['CTR (%)', `${data.ctr.toFixed(2)}%`], ['Connect Rate (%)', `${data.connectRate.toFixed(2)}%`],
                    ['Conv. LP (%)', `${data.convLP.toFixed(2)}%`], ['Conv. Checkout (%)', `${data.convCheckout.toFixed(2)}%`],
                ],
                theme: 'striped', headStyles: { fillColor: [0, 51, 102] }
            });

            autoTable(pdf, {
                head: [['Resultado Estimado', 'Valor Projetado']],
                body: [
                    ['ROAS Projetado (x)', `${data.roas.toFixed(2)}x`], ['Receita (R$)', `R$ ${data.receita.toFixed(2)}`],
                    ['Vendas', data.vendas.toFixed(0)], ['CPA (Custo por Aquisição)', `R$ ${data.cpa.toFixed(2)}`],
                ],
                theme: 'grid', headStyles: { fillColor: [0, 51, 102] }
            });

            // --- PÁGINA 3: ANÁLISE DETALHADA ---
            pdf.addPage();
            pdf.setFontSize(18).text("Análise Detalhada do Funil", margin, 25);
            pdf.setFontSize(14).text("Diagnóstico e Recomendações", margin, 35);
            let lastY = 42;
            if (insights && insights.length > 0) {
                insights.forEach(insight => {
                    const typeText = insight.type === 'success' ? '[PONTO FORTE]' : insight.type === 'warning' ? '[PONTO DE ATENÇÃO]' : '[OBSERVAÇÃO]';
                    const splitText = pdf.splitTextToSize(`${typeText} ${insight.message}`, pageWidth - margin * 2 - 5);
                    if (lastY + (splitText.length * 5) > pageHeight - 30) { pdf.addPage(); lastY = 25; }
                    pdf.setFontSize(10).setTextColor(80).text(splitText, margin, lastY);
                    lastY += (splitText.length * 5) + 4;
                });
            } else {
                pdf.setFontSize(10).setTextColor(80).text("Nenhum insight específico gerado.", margin, lastY);
                lastY += 8;
            }

            pdf.setFontSize(14).text("Taxas de Conversão do Funil", margin, lastY + 5);
            autoTable(pdf, {
                startY: lastY + 10,
                head: [['Etapa', 'Taxa de Conversão']],
                body: [
                    ['Visitas para Checkouts (Conv. LP)', `${data.convLP.toFixed(2)}%`],
                    ['Checkouts para Vendas (Conv. Checkout)', `${data.convCheckout.toFixed(2)}%`],
                    ['Visitas para Vendas (Conversão Geral)', `${((data.vendas / data.visitas) * 100 || 0).toFixed(2)}%`],
                ],
                theme: 'grid', headStyles: { fillColor: [0, 51, 102] }
            });
            lastY = pdf.lastAutoTable.finalY;

            pdf.setFontSize(14).text("Próximos Passos Sugeridos", margin, lastY + 10);
            const nextSteps = `Com base na análise, sugerimos focar nas métricas sinalizadas como "Ponto de Atenção". Pequenas melhorias em taxas de conversão iniciais, como o CTR, podem gerar um impacto exponencial no resultado final. Monitore a campanha de perto e utilize estes dados como um guia para otimizações contínuas.`;
            pdf.setFontSize(11).setTextColor(100).text(pdf.splitTextToSize(nextSteps, pageWidth - margin * 2), margin, lastY + 15);

            pdf.addPage();
            pdf.setFontSize(18).text("Visualização de Dados e Glossário", margin, 25);
            pdf.setFontSize(14).text("Gráfico do Funil de Vendas", margin, 35);
            pdf.addImage(chartImageData, 'PNG', margin, 40, pageWidth - margin * 2, (pageWidth - margin * 2) / 1.8);
            autoTable(pdf, {
                startY: 150,
                head: [['Métrica', 'Descrição Detalhada']],
                body: [
                    ['ROAS', 'Retorno Sobre o Investimento em Anúncios. Mede a receita gerada para cada real gasto.'],
                    ['CPA', 'Custo Por Aquisição. O custo médio para adquirir um cliente.'],
                    ['CPC', 'Custo Por Clique. O valor pago por cada clique no anúncio.'],
                    ['CPM', 'Custo Por Mil Impressões. O custo para exibir um anúncio mil vezes.'],
                    ['CTR', 'Taxa de Cliques. % de impressões que resultam em clique.'],
                    ['Connect Rate', 'Taxa de Conexão. % de cliques que carregam a página de destino.'],
                    ['Conv. LP', 'Taxa de Conversão da Landing Page. % de visitantes que iniciam o checkout.'],
                    ['Conv. Checkout', '% de pessoas que iniciam o checkout e finalizam a compra.'],
                ],
                theme: 'striped', headStyles: { fillColor: [0, 51, 102] },
                columnStyles: { 1: { cellWidth: 'auto' } }
            });

            pdf.save(`Relatorio_Projecao_${productName.replace(/ /g, '_') || 'Campanha'}.pdf`);

        } catch (err) {
            console.error("Erro detalhado ao gerar PDF:", err);
            alert("Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.");
        } finally {
            setPdfRendering(false);
        }
    };

    // LÓGICA DO CSV CORRIGIDA COM useMemo
    const csvData = useMemo(() => {
        // Retorna um array vazio se os dados não estiverem prontos, evitando o erro
        if (!data || data.investimento === undefined) {
            return [];
        }
        const headers = ["Produto", "Investimento (R$)", "Preco Produto (R$)", "ROAS Desejado", "CPM (R$)", "CTR (%)", "Connect Rate (%)", "Conv LP (%)", "Conv Checkout (%)", "ROAS Projetado", "Receita (R$)", "Vendas", "CPA (R$)", "Impressoes", "Cliques", "Visitas LP", "Checkouts"];
        const rowData = [
            productName, data.investimento.toFixed(2), data.precoMedio.toFixed(2), data.roasDesejado.toFixed(2), data.cpm.toFixed(2), 
            data.ctr.toFixed(2), data.connectRate.toFixed(2), data.convLP.toFixed(2), data.convCheckout.toFixed(2), 
            data.roas.toFixed(2), data.receita.toFixed(2), data.vendas.toFixed(0), data.cpa.toFixed(2), 
            data.impressoes.toFixed(0), data.cliques.toFixed(0), data.visitas.toFixed(0), data.checkouts.toFixed(0)
        ];
        return [headers, rowData];
    }, [data, productName]);


    return (
        <div className={styles.exportContainer}>
            <button className={styles.exportButtonPdf} onClick={handleExportPDF}>
                Exportar Relatório PDF
            </button>
            <CSVLink 
                data={csvData} 
                filename={`projecao_roas_${productName.replace(/ /g, '_') || 'geral'}.csv`} 
                className={styles.exportButtonCsv} 
                target="_blank"
            >
                Exportar Planilha CSV
            </CSVLink>
        </div>
    );
};

export default ExportControls;