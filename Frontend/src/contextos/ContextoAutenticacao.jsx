import { createContext, useState, useEffect } from 'react';
import { auth } from '../servicos/api';

// eslint-disable-next-line react-refresh/only-export-components
export const ContextoAutenticacao = createContext();

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [estaCarregando, setEstaCarregando] = useState(true);

  // verifica se já tem login salvo ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');
    if (token && usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setEstaCarregando(false);
  }, []);

  const fazerLogin = async (email, senha) => {
    const dados = await auth.login(email, senha);
    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(dados.usuario));
    setUsuario(dados.usuario);
    return dados;
  };

  const fazerLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <ContextoAutenticacao.Provider value={{ usuario, estaCarregando, fazerLogin, fazerLogout }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}
