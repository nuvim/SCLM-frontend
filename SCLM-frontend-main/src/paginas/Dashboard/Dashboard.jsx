import { useState, useEffect } from 'react';
import { dashboard } from '../../servicos/api';
import CardEstatistica from '../../componentes/CardEstatistica/CardEstatistica';
import GraficoRosca from '../../componentes/GraficoRosca/GraficoRosca';
import './Dashboard.css';

export default function Dashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [dadosArtista, setDadosArtista] = useState(null);
  const [dadosGenero, setDadosGenero] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await dashboard.obterEstatisticas();

        setEstatisticas({
          tempo: '—',
          total: dados.totalMusicas + dados.totalLinks,
          downloads: 0,
        });

        // agrupa músicas por artista para o gráfico
        const contagemArtistas = {};
        dados.ultimasMusicas.forEach(m => {
          const artista = m.artista || 'Desconhecido';
          contagemArtistas[artista] = (contagemArtistas[artista] || 0) + 1;
        });
        const totalArtistas = Object.values(contagemArtistas).reduce((a, b) => a + b, 0);
        setDadosArtista(
          Object.entries(contagemArtistas).map(([label, qtd]) => ({
            label,
            porcentagem: Math.round((qtd / totalArtistas) * 100),
          }))
        );

        // agrupa links por categoria para o gráfico
        const contagemCategorias = {};
        dados.ultimosLinks.forEach(l => {
          const cat = l.categoria || 'Sem categoria';
          contagemCategorias[cat] = (contagemCategorias[cat] || 0) + 1;
        });
        const totalCats = Object.values(contagemCategorias).reduce((a, b) => a + b, 0);
        setDadosGenero(
          Object.entries(contagemCategorias).map(([label, qtd]) => ({
            label,
            porcentagem: Math.round((qtd / totalCats) * 100),
          }))
        );
      } catch (erro) {
        console.error('Erro ao carregar dashboard:', erro);
      }
    };

    carregarDados();
  }, []);

  if (!estatisticas || !dadosArtista || !dadosGenero) {
    return <div className="carregando">Carregando painel...</div>;
  }

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
