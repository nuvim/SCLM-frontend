import { createContext, useState, useEffect } from 'react';
import { usuarioFake } from '../servicos/dadosFake';

// eslint-disable-next-line react-refresh/only-export-components
export const ContextoAutenticacao = createContext();

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [estaCarregando, setEstaCarregando] = useState(true);

  // verifica se ja tem login salvo ao carregar
  useEffect(() => {
    const token = localStorage.getItem('facade_token');
    if (token) {
      setUsuario(usuarioFake);
    }
    setEstaCarregando(false);
  }, []);

  // requisicao de login
  const fazerLogin = async (/* email, senha */) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // aceitando qualquer login por enquanto
        localStorage.setItem('facade_token', 'token-fake-123');
        setUsuario(usuarioFake);
        resolve(true);
      }, 800);
    });
  };

  const fazerLogout = () => {
    localStorage.removeItem('facade_token');
    setUsuario(null);
  };

  return (
    <ContextoAutenticacao.Provider value={{ usuario, estaCarregando, fazerLogin, fazerLogout }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}
