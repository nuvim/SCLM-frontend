import './CardEstatistica.css';

export default function CardEstatistica({ titulo, valor }) {
  return (
    <div className="card-estatistica">
      <h3 className="card-estatistica-titulo">{titulo}</h3>
      <div className="card-estatistica-valor">{valor}</div>
    </div>
  );
}
