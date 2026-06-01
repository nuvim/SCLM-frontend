import './GraficoRosca.css';

export default function GraficoRosca({ titulo, dados }) {
  // calcula os graus para o conic-gradient
  let soma = 0;
  const cores = {
    vermelho: 'var(--cor-vermelho)',
    azul: 'var(--cor-azul-grafico)',
    cinza: 'var(--cor-cinza-grafico)'
  };

  const corPorIndice = [cores.azul, cores.vermelho, cores.cinza];
  
  const partes = dados.map((dado, index) => {
    const inicio = soma;
    soma += dado.porcentagem;
    const fim = soma;
    return `${corPorIndice[index % corPorIndice.length]} ${inicio}% ${fim}%`;
  });

  const gradiente = `conic-gradient(${partes.join(', ')})`;

  return (
    <div className="grafico-container">
      <h3 className="grafico-titulo">{titulo}</h3>
      
      <div className="grafico-rosca-wrapper">
        <div className="grafico-rosca" style={{ background: gradiente }}>
          <div className="grafico-furo"></div>
        </div>

        {/* labels de porcentagem desenhados por cima do css */}
        <div className="grafico-labels">
          {dados.map((dado, idx) => (
            <div key={idx} className="grafico-label-item">
              <span className="bolinha-cor" style={{ backgroundColor: corPorIndice[idx % corPorIndice.length] }}></span>
              <span>{dado.porcentagem}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
