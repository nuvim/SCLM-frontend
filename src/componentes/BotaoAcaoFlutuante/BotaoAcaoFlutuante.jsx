import { Link } from 'react-router-dom';
import './BotaoAcaoFlutuante.css';

export default function BotaoAcaoFlutuante({ rota, onClick, icone1, icone2 }) {
  const conteudo = (
    <div className="fab-conteudo">
      {icone2 && (
        <span className="material-icons icone-pequeno">{icone2}</span>
      )}
      <span className="material-icons icone-grande">{icone1 || icone2}</span>
    </div>
  );

  if (onClick) {
    return (
      <button className="btn-flutuante" onClick={onClick}>
        {conteudo}
      </button>
    );
  }

  return (
    <Link to={rota} className="btn-flutuante">
      {conteudo}
    </Link>
  );
}
