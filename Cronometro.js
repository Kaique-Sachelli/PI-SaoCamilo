import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(true);
  const [agua, setAgua] = useState(400);

  useEffect(() => {
    let timer;

    if (ativo) {
      timer = setInterval(() => {
        setSegundos((s) => s + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [ativo]);

  const formatarTempo = () => {
    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  return (
    <div className="app">
      <div className="topo">
        <div className="status">
          <span className="bolinha"></span>
          SESSÃO ATIVA
        </div>

        <div className="modo">Corrida intervalar</div>
      </div>

      <div className="tempo">
        <p>TEMPO DECORRIDO</p>
        <h1>{formatarTempo()}</h1>
      </div>

      <div className="agua-area">
        <div className="circulo">
          <div className="gota">💧</div>

          <h2>{agua}</h2>

          <span>ml ingeridos</span>
        </div>
      </div>

      <div className="titulo-hidratacao">
        ADICIONAR HIDRATAÇÃO
      </div>

      <div className="cards">
        <div className="card">
          <div className="icone">🥤</div>

          <h3>Copinho</h3>

          <p>200 ml</p>

          <div className="botoes">
            <button onClick={() => setAgua(agua + 200)}>
              +
            </button>

            <button
              onClick={() =>
                setAgua(Math.max(0, agua - 200))
              }
            >
              −
            </button>
          </div>
        </div>

        <div className="card">
          <div className="icone">🧴</div>

          <h3>Garrafa</h3>

          <p>1000 ml</p>

          <div className="botoes">
            <button onClick={() => setAgua(agua + 1000)}>
              +
            </button>

            <button
              onClick={() =>
                setAgua(Math.max(0, agua - 1000))
              }
            >
              −
            </button>
          </div>
        </div>
      </div>

      <button className="alimento">
        ☕ Registrar alimento (opcional)
      </button>

      <div className="rodape">
        <button
          className="btn"
          onClick={() => setAtivo(!ativo)}
        >
          {ativo ? "⏸ Pausar" : "▶ Retomar"}
        </button>

        <button
          className="btn"
          onClick={() => {
            setSegundos(0);
            setAgua(0);
            setAtivo(false);
          }}
        >
          ⏹ Encerrar
        </button>
      </div>
    </div>
  );
}