import React from 'react';
import './Sessoes.css';
import fundo from './Img/Background.png';
import casa from './Img/Home.png'
import atividade from './Img/Activity.png'
import texto from './Img/Filetext.png'
import usuario from './Img/User.png'
const sessoesDados = [
  { id: 'ultima', titulo: 'Última sessão', data: '22/04/2026, 10:02', duracao: '90 min', ingestao: '1.8L', perda: '1.5%' },
  { id: 4, titulo: 'Sessão 4', data: '05/04/2026, 12:56', duracao: '87 min', ingestao: '1.8L', perda: '1.5%' },
  { id: 3, titulo: 'Sessão 3', data: '22/03/2026, 18:02', duracao: '30 min', ingestao: '500ml', perda: '1.5%' },
  { id: 2, titulo: 'Sessão 2', data: '22/03/2026, 18:02', duracao: '30 min', ingestao: '500ml', perda: '1.5%' },
];

export default function Sessoes() {
  return (
    <div className="tela-android-cheia" style={{ fundo: `url(${fundo})` }}>
      
      <div className="header">
        <button className="botao-voltar">&lt;</button>
        <h1 className="usuario-nome">Marcus Silva</h1>
        <p className="usuario-subtitulo">Vôlei</p>
      </div>

      <div className="conteudo-scroll">
        
        <div className="grid-resumo">
          <div className="card-mini">
            <span className="icone coracao">❤️</span>
            <span className="valor-resumo">5</span>
            <span className="legenda-resumo">Sessões/Semana</span>
          </div>
          <div className="card-mini">
            <span className="icone gota">💧</span>
            <span className="valor-resumo">2.4</span>
            <span className="legenda-resumo">L médio</span>
          </div>
          <div className="card-mini">
            <span className="icone coracao">📊</span>
            <span className="valor-resumo">1.8%</span>
            <span className="legenda-resumo">Perda média</span>
          </div>
        </div>

        <div className="lista-sessoes">
          {sessoesDados.map((sessao) => (
            <div key={sessao.id} className="card-sessao">
              <div className="topo-card">
                <h3 className={`titulo-sessao ${sessao.id === 'ultima' ? 'destaque-vermelho' : ''}`}>
                  {sessao.titulo}
                </h3>
                <span className="seta-direita">&gt;</span>
              </div>

              <div className="linhas-detalhes">
                <div className="linha-info">
                  <span className="rotulo">Data</span>
                  <span className="dado">{sessao.data}</span>
                </div>
                <div className="linha-info">
                  <span className="rotulo">Duração</span>
                  <span className="dado">{sessao.duracao}</span>
                </div>
                <div className="linha-info">
                  <span className="rotulo">Ingestão de líquidos</span>
                  <span className="dado">{sessao.ingestao}</span>
                </div>
                <div className="linha-info">
                  <span className="rotulo">Perda de peso</span>
                  <span className="dado perda-verde">{sessao.perda}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="menu-inferior">
        <button className="botao-menu-item"><img src="src/Img/Home.png" alt="ícone"/></button>
        <button className="botao-menu-item"><img src="src/Img/Activity.png" alt="ícone"/></button>
        <button className="botao-menu-item"><img src="src/Img/Filetext.png" alt="ícone"/></button>
        <button className="botao-menu-item"><img src="src/Img/User.png" alt="ícone"/></button>
      </div>

    </div>
  );
}