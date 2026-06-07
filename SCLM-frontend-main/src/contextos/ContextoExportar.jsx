import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ContextoExportar = createContext();

export function ProvedorExportar({ children }) {
  const [modalExportarAberto, setModalExportarAberto] = useState(false);

  return (
    <ContextoExportar.Provider value={{ modalExportarAberto, setModalExportarAberto }}>
      {children}
    </ContextoExportar.Provider>
  );
}