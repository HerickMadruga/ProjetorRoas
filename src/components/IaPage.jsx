import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from './IaPage.module.css';

const IaPage = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prompt || "Nenhum dado enviado. Por favor, retorne à calculadora.");
  const selectedAI = location.state?.selectedAI || "gemini";
  const [canOpen, setCanOpen] = useState(true);
  const [copyStatus, setCopyStatus] = useState("Copiar Prompt");

  useEffect(() => {
    if (location.state?.prompt) {
        setPrompt(location.state.prompt);
    }
    if (selectedAI === 'gemini' || selectedAI === 'chatgpt') {
        setCanOpen(true);
    } else {
        setCanOpen(false);
    }
  }, [location.state?.prompt, selectedAI]);

  const handleOpenAI = () => {
    const encodedPrompt = encodeURIComponent(prompt);
    if (selectedAI === 'gemini') {
      window.open(`https://gemini.google.com/app?prompt=${encodedPrompt}`, '_blank');
    } else if (selectedAI === 'chatgpt') {
      window.open(`https://chat.openai.com/?model=gpt-4o&message=${encodedPrompt}`, '_blank');
    } else {
      alert('Esta IA não suporta o envio de prompt via URL. Por favor, copie o texto manualmente.');
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
        .then(() => {
            setCopyStatus("Copiado!");
            setTimeout(() => setCopyStatus("Copiar Prompt"), 2000);
        })
        .catch(err => {
            console.error('Falha ao copiar o texto: ', err);
            alert('Falha ao copiar. Por favor, copie o texto manualmente.');
        });
  };

  return (
    <div className={styles.container}>
      <h1>Seu Prompt para Análise de IA</h1>
      {canOpen ? (
        <p>
          Edite o prompt abaixo e clique em "Abrir no {selectedAI === 'gemini' ? 'Gemini' : 'ChatGPT'}" para enviar para a IA.
        </p>
      ) : (
        <p>
          Copie o prompt abaixo e cole-o manualmente na plataforma da {selectedAI === 'jasper' ? 'Jasper AI' : selectedAI === 'semrush' ? 'Semrush AI' : 'Surfer AI'}.
        </p>
      )}
      <div className={styles.promptArea}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={styles.promptTextarea}
        />
        <button
            className={styles.copyButton}
            onClick={handleCopy}
        >
            {copyStatus}
        </button>
      </div>
      {canOpen && (
        <button
          className={styles.openAiButton}
          onClick={handleOpenAI}
        >
          Abrir no {selectedAI === 'gemini' ? 'Gemini' : 'ChatGPT'}
        </button>
      )}
    </div>
  );
};

export default IaPage;