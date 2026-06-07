import { Link } from 'react-router-dom';
import './CardNavegacao.css';

export default function CardNavegacao({ icone, texto, rota }) {
  return (
    <Link to={rota} className="card-navegacao">
      {icone ? (
        <span className="material-icons icone-card">{icone}</span>
      ) : (
        <span className="texto-card">{texto}</span>
      )}
    </Link>
  );
}
