import { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ContextoTema = createContext();

export function ProvedorTema({ children }) {
  const [temaEscuro, setTemaEscuro] = useState(false);

  // carrega tema salvo
  useEffect(() => {
    const temaSalvo = localStorage.getItem('facade_tema');
    if (temaSalvo === 'escuro') {
      setTemaEscuro(true);
      document.documentElement.setAttribute('data-tema', 'escuro');
    }
  }, []);

  const alternarTema = () => {
    setTemaEscuro((anterior) => {
      const novoTema = !anterior;
      if (novoTema) {
        document.documentElement.setAttribute('data-tema', 'escuro');
        localStorage.setItem('facade_tema', 'escuro');
      } else {
        document.documentElement.removeAttribute('data-tema');
        localStorage.setItem('facade_tema', 'claro');
      }
      return novoTema;
    });
  };

  return (
    <ContextoTema.Provider value={{ temaEscuro, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  );
}
