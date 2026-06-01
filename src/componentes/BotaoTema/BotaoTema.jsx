import { useContext } from 'react';
import { ContextoTema } from '../../contextos/ContextoTema';
import './BotaoTema.css';

export default function BotaoTema({ flutuante = false }) {
  const { temaEscuro, alternarTema } = useContext(ContextoTema);

  return (
    <button 
      className={`btn-tema ${flutuante ? 'flutuante' : ''}`} 
      onClick={alternarTema}
      title={temaEscuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      <span className="material-icons">
        {temaEscuro ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
