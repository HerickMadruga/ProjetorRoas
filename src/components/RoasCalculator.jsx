import React, { useState } from 'react';
import styles from './RoasCalculator.module.css';
import logo from "/logo-trinity.png"
import Summary from './Summary';
import ChartSection from './ChartSection';
import DataInsights from './DataInsights';
import AIExportButton from './AIExportButton';

const RoasCalculator = () => {
    // Estados para os valores de entrada
    const [investimento, setInvestimento] = useState('');
    const [precoMedio, setPrecoMedio] = useState('');
    const [roasDesejado, setRoasDesejado] = useState('');
    const [cpm, setCpm] = useState('');
    const [ctr, setCtr] = useState('');
    const [connectRate, setConnectRate] = useState('');
    const [convLP, setConvLP] = useState('');
    const [convCheckout, setConvCheckout] = useState('');

    // Função auxiliar para converter strings para números e lidar com vírgulas
    const parse = (value) => parseFloat(value.replace(',', '.')) || 0;

    // Métricas de mercado para os avisos
    const marketAverages = {
        ctr: 2.5,
        connectRate: 85.0,
        convLP: 2.0,
        convCheckout: 85.0,
    };

    // Função que calcula todos os resultados e retorna um objeto completo
    const resultados = () => {
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

        // É crucial retornar um objeto com **todos os dados** para o componente de IA
        return {
            investimento: inv, 
            precoMedio: preco, 
            roasDesejado: rMeta,
            cpm: _cpm, 
            ctr: parse(ctr),
            connectRate: parse(connectRate),
            convLP: parse(convLP), 
            convCheckout: parse(convCheckout),
            impressoes, 
            cliques, 
            cpc, 
            visitas, 
            checkouts, 
            vendas, 
            receita, 
            roas, 
            cpa, 
            taxaLP,
            rMeta
        };
    };

    const {
        impressoes, cliques, cpc, visitas, checkouts, vendas, receita, roas, cpa, taxaLP, rMeta
    } = resultados();

    const getAviso = (metric, value) => {
        const avg = marketAverages[metric];
        
        if (value === 0 && metric !== 'roas') {
            return {
                message: `Por favor, preencha o valor desta métrica (deve ser zero ou maior).`,
                type: 'info'
            };
        }

        const formattedValue = typeof value === 'number' ? value.toFixed(2) : '0.00';
        
        if (metric === 'roas') {
            if (roas === 0 || rMeta === 0) {
                return { message: 'Aguardando dados da campanha e ROAS desejado...', type: 'info' };
            }
            if (roas >= rMeta) {
                return { message: `Excelente! Seu resultado atual (${roas.toFixed(2)}x) atinge ou supera a meta (${rMeta.toFixed(2)}x).`, type: 'success' };
            } else {
                return { message: `Seu resultado atual (${roas.toFixed(2)}x) está abaixo da meta (${rMeta.toFixed(2)}x).`, type: 'warning' };
            }
        }
        
        if (avg) {
            if (value >= avg * 1.5) {
                return { message: `Seu resultado (${formattedValue}%) está muito acima da média (${avg.toFixed(2)}%).`, type: 'success' };
            } else if (value >= avg * 0.9) {
                return { message: `Seu resultado (${formattedValue}%) está dentro da média (${avg.toFixed(2)}%).`, type: 'info' };
            } else {
                return { message: `Seu resultado (${formattedValue}%) está abaixo da média (${avg.toFixed(2)}%).`, type: 'warning' };
            }
        }
        return { message: '', type: 'info' };
    };

    const getGeneralAviso = () => {
        if (parse(investimento) === 0 || parse(precoMedio) === 0 || parse(roasDesejado) === 0) {
            return { message: 'Por favor, preencha os Dados da Campanha (todos devem ser maiores que zero).', type: 'warning' };
        }
        return null;
    };
    
    const generalAviso = getGeneralAviso();

    return (
        <div className={styles.container}>
            <img src={logo} alt="logo" className='Imagemm' style={{ width: '600px', height: 'auto' }}/>
            <Summary />
            <br/>
            <h1>Projetor de ROAS Trinity</h1>
            {generalAviso && <p className={`${styles['general-aviso']} ${styles[generalAviso.type]}`}>{generalAviso.message}</p>}
            
            <div className={styles.inputs}>
                {[
                    { label: 'Preço Médio do Produto (R$):', state: precoMedio, setState: setPrecoMedio },
                    { label: 'Investimento em Anúncios (R$):', state: investimento, setState: setInvestimento },
                    { label: 'ROAS Desejado (x):', state: roasDesejado, setState: setRoasDesejado },
                    { label: 'CPM (R$):', state: cpm, setState: setCpm },
                    { label: 'CTR (%):', state: ctr, setState: setCtr, metricName: 'ctr' },
                    { label: 'Connect Rate (%):', state: connectRate, setState: setConnectRate, metricName: 'connectRate' },
                    { label: 'Conv. da LP para Checkout (%):', state: convLP, setState: setConvLP, metricName: 'convLP' },
                    { label: 'Conv. do Checkout (%):', state: convCheckout, setState: setConvCheckout, metricName: 'convCheckout' },
                ].map(({ label, state, setState, metricName }, idx) => {
                    const aviso = metricName ? getAviso(metricName, parse(state)) : { message: '', type: 'info' };
                    return (
                        <div key={idx} className={`${styles['input-group']} ${styles[aviso.type]}`}>
                            <label>
                                {label}{' '}
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="0,00"
                                />
                            </label>
                            {aviso.message && (
                                <span className={styles.aviso}>
                                    {aviso.message}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles['roas-destaque']}>
                <p>ROAS (x): {roas.toFixed(2)}</p>
            </div>
            <div><p className={`${styles['aviso-roas']} ${styles[getAviso('roas', roas).type]}`}>{getAviso('roas', roas).message}</p></div>
            <div className={styles.resultados}>
                <h2>Resultados Estimados</h2>
                <p>Impressões: {impressoes.toFixed(0)}</p>
                <p>Cliques: {cliques.toFixed(0)}</p>
                <p>CPC (R$): {cpc.toFixed(2)}</p>
                <p>Visitas (LP): {visitas.toFixed(0)}</p>
                <p>Checkouts Iniciados: {checkouts.toFixed(0)}</p>
                <p>Vendas Realizadas: {vendas.toFixed(0)}</p>
                <p>CPA (R$): {cpa.toFixed(2)}</p>
                <p>Receita (R$): {receita.toFixed(2)}</p>
                <p>Taxa da LP (%): {taxaLP.toFixed(2)}</p>
            </div>
            
            <DataInsights data={resultados()} />
            <br/>
            <hr/>
            <br/>
            <ChartSection data={resultados()} />
            <br/>
            <hr/>
            <br/>
            
            {/* Componente de IA que agora lida com o redirecionamento */}
            <AIExportButton data={resultados()} />
            <br/>
            <hr/>
            <br/>
            <div><p>Feito por @herick_madruga</p></div>
        </div>
    );
};

export default RoasCalculator;