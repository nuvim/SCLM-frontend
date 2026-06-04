import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorTema } from './contextos/ContextoTema';
import { ProvedorAutenticacao } from './contextos/ContextoAutenticacao';
import LayoutAutenticado from './componentes/LayoutAutenticado/LayoutAutenticado';
import Login from './paginas/Login/Login';
import Cadastro from './paginas/Login/Cadastro';
import Dashboard from './paginas/Dashboard/Dashboard';
import MusicaInicial from './paginas/Musicas/MusicaInicial';
import LinkInicial from './paginas/Links/LinkInicial';
import EsqueceuSenha from './paginas/Login/EsqueceuSenha';
import './App.css';

function App() {
  return (
    <ProvedorTema>
      <ProvedorAutenticacao>
        <BrowserRouter>
          <Routes>
            {/* Rotas Publicas */}
            <Route path="/login" element={<Login />} />        
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />

            {/* rotas protegidas com navbar */}
            <Route element={<LayoutAutenticado />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/musicas" element={<MusicaInicial />} />
              <Route path="/links" element={<LinkInicial />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </ProvedorAutenticacao>
    </ProvedorTema>
  );
}

export default App;
