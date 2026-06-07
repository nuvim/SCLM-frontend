import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { ContextoAutenticacao } from '../../contextos/ContextoAutenticacao';
import Navbar from '../Navbar/Navbar';
import './LayoutAutenticado.css';

export default function LayoutAutenticado() {
  const { usuario, estaCarregando } = useContext(ContextoAutenticacao);

  if (estaCarregando) {
    return <div className="tela-carregamento">Carregando...</div>;
  }

  // se nao estiver logado, manda pro login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-autenticado">
      <Navbar />
      <main className="conteudo-principal">
        {/* Outlet renderiza a rota filha correspondente (Dashboard, Musicas, etc) */}
        <Outlet />
      </main>
    </div>
  );
}
