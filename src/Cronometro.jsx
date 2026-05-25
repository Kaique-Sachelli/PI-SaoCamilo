import { useEffect, useState } from "react";
import "./Cronometro.css";

export default function App() {
  const [tempo, setTempo] = useState(2842); // 00:47:22
  const [ativo, setAtivo] = useState(true);
  const [agua, setAgua] = useState(400);
  const [alimentos, setAlimentos] = useState([])
  useEffect(() => {
    let intervalo;

    if (ativo) {
      intervalo = setInterval(() => {
        setTempo((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(intervalo);
  }, [ativo]);

  function formatarTempo(segundos) {
    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(
      Math.floor((segundos % 3600) / 60)
    ).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  }

  function adicionarCopo() {
    setAgua((a) => a + 200);
  }

  function removerCopo() {
    setAgua((a) => Math.max(0, a - 200));
  }

  function adicionarGarrafa() {
    setAgua((a) => a + 1000);
  }

  function removerGarrafa() {
    setAgua((a) => Math.max(0, a - 1000));
  }

  function pausarOuRetomar() {
    setAtivo(!ativo);
  }

  function encerrarSessao() {
    setTempo(0);
    setAgua(0);
    setAtivo(false);
  }
  function registrarAlimento() {
    const nome = prompt("Digite o alimento consumido:");

    if (!nome || nome.trim() === "") return;

    setAlimentos((lista) => [...lista, nome]);
  }
  return (
    <div className="app">
      <header className="topo">
        <div className="status">
          <span className="led"></span>
          <span>SESSÃO ATIVA</span>
        </div>

        <span className="tipo">Corrida intervalar</span>
      </header>

      <section className="cronometro">
        <p>TEMPO DECORRIDO</p>

        <h1>{formatarTempo(tempo)}</h1>
      </section>

      <section className="hidratacao">
        <div className="circulo">
          <div className="gota">💧</div>

          <h2>{agua}</h2>

          <span>ml ingeridos</span>
        </div>
      </section>

      <p className="tituloHidratacao">
        ADICIONAR HIDRATAÇÃO
      </p>

      <section className="cards">
        <div className="card">
          <div className="icone">🥤</div>

          <h3>Copinho</h3>

          <p>200 ml</p>

          <div className="acoes">
            <button onClick={adicionarCopo} >+</button>
            <button onClick={removerCopo} >−</button>
          </div>
        </div>

        <div className="card">
          <div className="icone">🧴</div>

          <h3>Garrafa</h3>

          <p>1000 ml</p>

          <div className="acoes">
            <button onClick={adicionarGarrafa}>+</button>
            <button onClick={removerGarrafa}>−</button>
          </div>
        </div>
      </section>

      <button
        className="alimento"
        onClick={registrarAlimento}
      >
        ☕ Registrar alimento (opcional)
      </button>

      <div className="listaAlimentos">
        {alimentos.length === 0 ? (
          <p className="vazio">
            Nenhum alimento registrado
          </p>
        ) : (
          alimentos.map((item, index) => (
            <div
              key={index}
              className="itemAlimento"
            >
              ☕ {item}
            </div>
          ))
        )}
      </div>

      <section className="rodape">
        <button
          className="botao"
          onClick={pausarOuRetomar}
        >
          {ativo ? "⏸ Pausar" : "▶ Retomar"}
        </button>

        <button
          className="botao"
          onClick={encerrarSessao}
        >
          ⏹ Encerrar
        </button>
      </section>
    </div>
  );
}