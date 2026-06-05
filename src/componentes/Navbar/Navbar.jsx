import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContextoAutenticacao } from '../../contextos/ContextoAutenticacao';
import { ContextoExportar } from '../../contextos/ContextoExportar';
import BotaoTema from '../BotaoTema/BotaoTema';
import './Navbar.css';

export default function Navbar() {
  const { fazerLogout } = useContext(ContextoAutenticacao);
  const location = useLocation();
  const navegar = useNavigate();
  const { setModalExportarAberto } = useContext(ContextoExportar);

  // verifica em qual modulo estamos
  const isMusica = location.pathname.includes('/musicas');
  const isDashboard = location.pathname.includes('/dashboard');

  const tratarLogout = () => {
    fazerLogout();
    navegar('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-grupo-esq">
        <button className="btn-nav btn-nav-logout" onClick={tratarLogout} title="Sair">
          <span className="material-icons">logout</span>
        </button>
        <button className="btn-nav btn-nav-upload" onClick={() => setModalExportarAberto(true)}>
          <span className="material-icons">file_upload</span>
          <span className="upload-texto">Exportar</span>
        </button>
        {isMusica && (
          <button className="btn-nav"onClick={() => navegar('/dashboard')}>
            <span className="material-icons">bar_chart</span>
          </button>
        )}
        {isDashboard && (
          <button className="btn-nav"onClick={() => navegar('/musicas')}>
            <span className="material-icons">music_note</span>
          </button>
        )}
      </div>
      
      <div className="navbar-grupo-dir">
        {/* busca customizada pra musica ou busca normal pra links */}
        {isMusica ? (
          <div className="btn-nav btn-nav-busca">
            <div className="icone-svg"></div>
            <input className="busca-input" type="text" placeholder="Música ou Artista" />
          </div>
        ) : (
          <button className="btn-nav">
            <span className="material-icons">search</span>
          </button>
        )}

        {/* o toggle de tema na navbar */}
        <BotaoTema flutuante={false} />
      </div>
    </nav>
  );
}
