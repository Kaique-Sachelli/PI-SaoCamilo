import "./PerfilAtleta.css";
import fundo from "./Img/BackGround.png";
import perfilCard from "./Img/Fotoperfil.png";
export default function PerfilAtleta() {
    return (
        <div
            className="tela"
            style={{
                backgroundImage: `url(${fundo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div className="header">
                <div className="topBar">
                    <span className="back">←</span>

                    <div className="status"></div>
                </div>

                <h1>Kacique da Silva</h1>

                <p>Vôlei • Arremessador</p>
            </div>

            <div className="perfilCard">
                <img
                    className="foto"
                    src={perfilCard}
                    alt="Atleta"
                />

                <div className="dados">
                    <h2>Perfil Atlético</h2>

                    <div className="linha">
                        <span>Peso</span>
                        <strong>78 kg</strong>
                    </div>

                    <div className="linha">
                        <span>Altura</span>
                        <strong>177 cm</strong>
                    </div>

                    <div className="linha">
                        <span>Idade</span>
                        <strong>20 anos</strong>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>Acessar Histórico Atleta</h3>

                <button className="historicoBtn">
                    Histórico Longitudinal
                </button>
            </div>

            <div className="card">
                <h3>Contatos do Atleta</h3>

                <div className="contato">
                    <span>Email:</span>
                    <strong>Kaciquedasilva@gmail.com</strong>
                </div>

                <div className="contato">
                    <span>Telefone:</span>
                    <strong>(11) 4002-8922</strong>
                </div>
            </div>

            <button className="relatorioBtn">
                Adicionar Relatório alimentar
            </button>
        </div>
    );
}