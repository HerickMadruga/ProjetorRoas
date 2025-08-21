import React, { useState, useMemo, useEffect } from 'react';
import styles from './RoasCalculator.module.css';
import logo from "/logo-trinity.png"
import Summary from './Summary';
import ChartSection from './ChartSection';
import DataInsights from './DataInsights';
import AIExportButton from './AIExportButton';
import ExportControls from './ExportControls';

const InputField = ({ label, state, setState, metricName, placeholder = "0,00", getAviso, parse, disabled = false }) => {
    const aviso = metricName ? getAviso(metricName, parse(state)) : null;
    return (
        <div className={`${styles['input-group']} ${aviso ? styles[aviso.type] : ''}`}>
            <label>{label}</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder={placeholder} disabled={disabled} />
            {aviso && aviso.message && <span className={styles.aviso}>{aviso.message}</span>}
        </div>
    );
};

const RoasCalculator = () => {
    const [isPdfRendering, setIsPdfRendering] = useState(false);
    const [productName, setProductName] = useState('');
    const [investimento, setInvestimento] = useState('');
    const [precoMedio, setPrecoMedio] = useState('');
    const [roasDesejado, setRoasDesejado] = useState('');
    
    const [cpm, setCpm] = useState('');
    const [ctr, setCtr] = useState('');
    const [connectRate, setConnectRate] = useState('');
    const [convLP, setConvLP] = useState('');
    const [convCheckout, setConvCheckout] = useState('');

    const [isAutoMode, setIsAutoMode] = useState(false);

    const parse = (value) => parseFloat(String(value).replace(',', '.')) || 0;

    // Benchmarks de mercado como ponto de partida ou fallback
    const marketAverages = {
        cpm: '15.00', 
        ctr: '2.50', 
        connectRate: '85.00', 
        convLP: '5.00', // Adicionado um benchmark para convLP para robustez
        convCheckout: '85.00',
    };

    // NOVA LÓGICA DE CÁLCULO DE METAS
    useEffect(() => {
        if (isAutoMode) {
            const inv = parse(investimento);
            const preco = parse(precoMedio);
            const rMeta = parse(roasDesejado);

            if (inv > 0 && preco > 0 && rMeta > 0) {
                // 1. Calcular o número de vendas necessárias para a meta
                const vendasNecessarias = (inv * rMeta) / preco;

                // 2. Usar as métricas atuais do usuário ou os benchmarks como base
                const base_cpm = parse(cpm) || parse(marketAverages.cpm);
                const base_ctr = parse(ctr) || parse(marketAverages.ctr);
                const base_connectRate = parse(connectRate) || parse(marketAverages.connectRate);
                const base_convLP = parse(convLP) || parse(marketAverages.convLP);
                const base_convCheckout = parse(convCheckout) || parse(marketAverages.convCheckout);

                // 3. Calcular as vendas com as métricas de base
                const impressoesAtuais = (inv / base_cpm) * 1000;
                const vendasAtuais = impressoesAtuais * (base_ctr / 100) * (base_connectRate / 100) * (base_convLP / 100) * (base_convCheckout / 100);

                // 4. Se a meta for maior que o resultado atual, calcular a melhora necessária
                if (vendasAtuais > 0 && vendasNecessarias > vendasAtuais) {
                    const fatorDeMelhora = vendasNecessarias / vendasAtuais;
                    // Distribui a melhora entre 3 alavancas: CTR, ConvLP e ConvCheckout
                    const multiplicador = Math.pow(fatorDeMelhora, 1 / 3);

                    // 5. Calcula as novas metas de forma proporcional
                    let novo_ctr = base_ctr * multiplicador;
                    let novo_convLP = base_convLP * multiplicador;
                    let novo_convCheckout = base_convCheckout * multiplicador;
                    
                    // 6. Aplica tetos para manter as metas realistas
                    novo_ctr = Math.min(novo_ctr, 15); // Teto de 15% para CTR
                    novo_convLP = Math.min(novo_convLP, 50); // Teto de 50% para Conv. LP
                    novo_convCheckout = Math.min(novo_convCheckout, 98); // Teto de 98% para Conv. Checkout

                    // Atualiza os campos com as novas metas
                    setCpm(base_cpm.toFixed(2).replace('.', ','));
                    setConnectRate(base_connectRate.toFixed(2).replace('.', ','));
                    setCtr(novo_ctr.toFixed(2).replace('.', ','));
                    setConvLP(novo_convLP.toFixed(2).replace('.', ','));
                    setConvCheckout(novo_convCheckout.toFixed(2).replace('.', ','));
                } else {
                    // Se a meta já foi atingida ou não é possível calcular, usa os benchmarks como padrão
                    setCpm(marketAverages.cpm);
                    setCtr(marketAverages.ctr);
                    setConnectRate(marketAverages.connectRate);
                    setConvLP(marketAverages.convLP);
                    setConvCheckout(marketAverages.convCheckout);
                }
            }
        }
    }, [isAutoMode, investimento, precoMedio, roasDesejado, cpm, ctr, connectRate, convLP, convCheckout]);


    const resultados = useMemo(() => {
        const inv = parse(investimento);
        const preco = parse(precoMedio);
        const rMeta = parse(roasDesejado);
        const _cpm = parse(cpm);
        const _ctr = parse(ctr) / 100;
        const _connect = parse(connectRate) / 100;
        const _convLP = parse(convLP) / 100;
        const _convCheckout = parse(convCheckout) / 100;
        const impressoes = _cpm ? (inv / _cpm) * 1000 : 0;
        const cliques = impressoes * _ctr;
        const cpc = cliques ? inv / cliques : 0;
        const visitas = cliques * _connect;
        const checkouts = visitas * _convLP;
        const vendas = checkouts * _convCheckout;
        const receita = vendas * preco;
        const roas = inv ? receita / inv : 0;
        const cpa = vendas ? inv / vendas : 0;
        const taxaLP = visitas ? (checkouts / visitas) * 100 : 0;
        return {
            investimento: inv, precoMedio: preco, roasDesejado: rMeta, cpm: _cpm, 
            ctr: parse(ctr), connectRate: parse(connectRate), convLP: parse(convLP), 
            convCheckout: parse(convCheckout), impressoes, cliques, cpc, visitas, 
            checkouts, vendas, receita, roas, cpa, taxaLP, rMeta, isAutoMode
        };
    }, [investimento, precoMedio, roasDesejado, cpm, ctr, connectRate, convLP, convCheckout, isAutoMode]);

    const generatedInsights = useMemo(() => {
        const insights = [];
        const data = resultados;
        const benchmarks = { cpc: 2.0, ctr: 2.0, connectRate: 85, convLP: 2.0, convCheckout: 80, cpaRatio: 0.5 };
        if (isAutoMode) {
            insights.push({ type: 'info', message: `Para atingir um ROAS de ${data.roasDesejado.toFixed(2)}x, as métricas mais cruciais a serem alcançadas são uma Taxa de Conversão da Landing Page de aproximadamente ${data.convLP.toFixed(2)}%, mantendo as outras métricas dentro dos benchmarks de mercado.` });
        }
        if (data.cpc > benchmarks.cpc * 1.5) { insights.push({ type: 'warning', message: `O CPC (${data.cpc.toFixed(2)} R$) está alto. Considere melhorar a segmentação ou o anúncio.` }); }
        if (data.ctr < benchmarks.ctr) { insights.push({ type: 'warning', message: `O CTR (${data.ctr.toFixed(2)}%) está abaixo da média. O anúncio pode não ser atraente.` }); }
        if (data.connectRate < benchmarks.connectRate) { insights.push({ type: 'warning', message: `O Connect Rate (${data.connectRate.toFixed(2)}%) está baixo. Verifique a velocidade da sua página.` }); }
        if (data.cpa > data.rMeta * benchmarks.cpaRatio) { insights.push({ type: 'warning', message: `O CPA (${data.cpa.toFixed(2)} R$) está alto em relação à sua meta de ROAS.` }); }
        if (data.roas > data.rMeta && data.rMeta > 0) { insights.push({ type: 'success', message: `O ROAS estimado (${data.roas.toFixed(2)}x) supera sua meta!` }); }
        if (insights.length === 0 && data.investimento > 0) { insights.push({ type: 'info', message: 'Nenhum ponto crítico encontrado. Seu funil parece saudável!' }); }
        return insights;
    }, [resultados, isAutoMode]);
    
    const getAviso = () => ({ message: '', type: 'info' });
    const getGeneralAviso = () => {
        if (parse(investimento) === 0 || parse(precoMedio) === 0 || parse(roasDesejado) === 0) {
            return { message: 'Preencha os Dados da Campanha (Investimento, Preço e ROAS Desejado).', type: 'warning' };
        } return null;
    };
    const generalAviso = getGeneralAviso();

    return (
        <div className={styles.container}>
            <img src={logo} alt="logo" className={styles.Imagemm} />
            <Summary />
            <br/>
            <h1>Projetor de ROAS Trinity</h1>
            {generalAviso && <p className={`${styles['general-aviso']} ${styles[generalAviso.type]}`}>{generalAviso.message}</p>}
            
            <div className={styles.inputsContainer}>
                <div className={styles.inputSection}>
                    <h3 className={styles.sectionTitle}>Informações da Campanha e Metas</h3>
                    <div className={styles.inputs}>
                        <div className={styles.fullWidth}>
                             <InputField label="Nome do Produto/Serviço:" state={productName} setState={setProductName} placeholder="Ex: Consultoria de Marketing" getAviso={getAviso} parse={parse} />
                        </div>
                        <InputField label="Investimento em Anúncios (R$):" state={investimento} setState={setInvestimento} getAviso={getAviso} parse={parse} />
                        <InputField label="Preço Médio do Produto (R$):" state={precoMedio} setState={setPrecoMedio} getAviso={getAviso} parse={parse} />
                        <div className={styles.fullWidth}>
                            <InputField label="ROAS Desejado (x):" state={roasDesejado} setState={setRoasDesejado} getAviso={getAviso} parse={parse} />
                        </div>
                    </div>
                </div>

                <div className={styles.inputSection}>
                    <div className={styles.modeToggleSection}>
                        <span>Simular com minhas métricas</span>
                        <label className={styles.toggleSwitchContainer}>
                            <input type="checkbox" checked={isAutoMode} onChange={() => setIsAutoMode(!isAutoMode)} />
                            <span className={styles.toggleSwitch}></span>
                        </label>
                        <span>Calcular métricas para a meta</span>
                    </div>
                    <h3 className={styles.sectionTitle}>Métricas do Funil de Vendas</h3>
                    <div className={styles.inputs}>
                        <InputField label="CPM (R$):" state={cpm} setState={setCpm} getAviso={getAviso} parse={parse} disabled={isAutoMode} />
                        <InputField label="CTR (%):" state={ctr} setState={setCtr} metricName="ctr" getAviso={getAviso} parse={parse} disabled={isAutoMode} />
                        <InputField label="Connect Rate (%):" state={connectRate} setState={setConnectRate} metricName="connectRate" getAviso={getAviso} parse={parse} disabled={isAutoMode} />
                        <InputField label="Conv. da LP para Checkout (%):" state={convLP} setState={setConvLP} metricName="convLP" getAviso={getAviso} parse={parse} disabled={isAutoMode} />
                        <InputField label="Conv. do Checkout (%):" state={convCheckout} setState={setConvCheckout} metricName="convCheckout" getAviso={getAviso} parse={parse} disabled={isAutoMode} />
                    </div>
                </div>
            </div>

            <div className={styles['roas-destaque']}><p>ROAS (x): {resultados.roas.toFixed(2)}</p></div>
            <div className={styles.resultados}>
                <h2>Resultados Estimados</h2>
                <p>Impressões: {resultados.impressoes.toFixed(0)}</p>
                <p>Cliques: {resultados.cliques.toFixed(0)}</p>
                <p>CPC (R$): {resultados.cpc.toFixed(2)}</p>
                <p>Visitas (LP): {resultados.visitas.toFixed(0)}</p>
                <p>Checkouts Iniciados: {resultados.checkouts.toFixed(0)}</p>
                <p>Vendas Realizadas: {resultados.vendas.toFixed(0)}</p>
                <p>CPA (R$): {resultados.cpa.toFixed(2)}</p>
                <p>Receita (R$): {resultados.receita.toFixed(2)}</p>
                <p>Taxa da LP (%): {resultados.taxaLP.toFixed(2)}</p>
            </div>
            
            <DataInsights insights={generatedInsights} />
            <br/><hr/><br/>
            <ChartSection data={resultados} isPdfRendering={isPdfRendering} />
            <br/><hr/><br/>
            
            <AIExportButton data={resultados} />
            <ExportControls 
                data={resultados} 
                insights={generatedInsights} 
                productName={productName}
                isAutoMode={isAutoMode}
                setPdfRendering={setIsPdfRendering} 
            />
            <br/>
            <div><p>Feito por @herick_madruga</p></div>
        </div>
    );
};

export default RoasCalculator;