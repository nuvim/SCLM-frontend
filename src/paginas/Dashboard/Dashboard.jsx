import { useState, useEffect } from 'react';
import { buscarEstatisticas, buscarDadosArtista, buscarDadosGenero } from '../../servicos/dadosFake';
import CardEstatistica from '../../componentes/CardEstatistica/CardEstatistica';
import GraficoRosca from '../../componentes/GraficoRosca/GraficoRosca';
import './Dashboard.css';

export default function Dashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [dadosArtista, setDadosArtista] = useState(null);
  const [dadosGenero, setDadosGenero] = useState(null);

  useEffect(() => {
    // >>> BACKEND: trocar chamadas abaixo por GET /api/dashboard/estatisticas e etc <<<
    const carregarEstatisticas = async () => {
      const stats = await buscarEstatisticas();
      const artistas = await buscarDadosArtista();
      const generos = await buscarDadosGenero();

      setEstatisticas(stats);
      setDadosArtista(artistas);
      setDadosGenero(generos);
    };

    carregarEstatisticas();
  }, []);

  if (!estatisticas || !dadosArtista || !dadosGenero) return <div className="carregando">Carregando painel...</div>;

  return (
    <div className="dashboard-container">
      <div className="cards-linha">
        <CardEstatistica titulo="Tempo" valor={estatisticas.tempo} />
        <CardEstatistica titulo="Total" valor={estatisticas.total} />
        <CardEstatistica titulo="Download" valor={estatisticas.downloads} />
      </div>

      <div className="graficos-linha">
        <GraficoRosca titulo="Artista" dados={dadosArtista} />
        <GraficoRosca titulo="Gênero" dados={dadosGenero} />
      </div>
    </div>
  );
}
