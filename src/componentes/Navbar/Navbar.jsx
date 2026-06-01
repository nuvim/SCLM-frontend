import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContextoAutenticacao } from '../../contextos/ContextoAutenticacao';
import BotaoTema from '../BotaoTema/BotaoTema';
import './Navbar.css';

export default function Navbar() {
  const { fazerLogout } = useContext(ContextoAutenticacao);
  const location = useLocation();
  const navegar = useNavigate();

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
        <button className="btn-nav" onClick={tratarLogout} title="Sair">
          <span className="material-icons">logout</span>
        </button>
        <button className="btn-nav" title="Upload">
          <span className="material-icons">file_upload</span>
        </button>
        {isMusica && (
          <button className="btn-nav" title="Estatísticas" onClick={() => navegar('/dashboard')}>
            <span className="material-icons">bar_chart</span>
          </button>
        )}
        {isDashboard && (
          <button className="btn-nav" title="Voltar para Músicas" onClick={() => navegar('/musicas')}>
            <span className="material-icons">music_note</span>
          </button>
        )}
      </div>
      
      <div className="navbar-grupo-dir">
        {/* busca customizada pra musica ou busca normal pra links */}
        {isMusica ? (
          <button className="btn-nav" title="Buscar Música">
            <div className="icone-svg"></div>
          </button>
        ) : (
          <button className="btn-nav" title="Buscar">
            <span className="material-icons">search</span>
          </button>
        )}

        {/* o toggle de tema na navbar */}
        <BotaoTema flutuante={false} />
      </div>
    </nav>
  );
}
