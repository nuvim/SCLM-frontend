import { useState, useEffect } from 'react';
import { dashboard } from '../../servicos/api';
import CardEstatistica from '../../componentes/CardEstatistica/CardEstatistica';
import GraficoRosca from '../../componentes/GraficoRosca/GraficoRosca';
import './Dashboard.css';

export default function Dashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [dadosArtista, setDadosArtista] = useState([]);
  const [dadosGenero, setDadosGenero] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await dashboard.obterEstatisticas();

        setEstatisticas({
          total: dados.totalMusicas + dados.totalLinks,
          totalMusicas: dados.totalMusicas,
          totalLinks: dados.totalLinks,
        });

        // converte para o formato esperado pelo GraficoRosca: { label, porcentagem }
        const totalGenero = dados.distribuicaoGenero.reduce((acc, g) => acc + g.total, 0);
        setDadosGenero(
          dados.distribuicaoGenero.map(g => ({
            label: g.label,
            porcentagem: totalGenero > 0 ? Math.round((g.total / totalGenero) * 100) : 0,
          }))
        );

        const totalArtista = dados.distribuicaoArtista.reduce((acc, a) => acc + a.total, 0);
        setDadosArtista(
          dados.distribuicaoArtista.map(a => ({
            label: a.label,
            porcentagem: totalArtista > 0 ? Math.round((a.total / totalArtista) * 100) : 0,
          }))
        );
      } catch (erro) {
        console.error('Erro ao carregar dashboard:', erro);
      }
    };

    carregarDados();
  }, []);

  if (!estatisticas) return <div className="carregando">Carregando painel...</div>;

  return (
    <div className="dashboard-container">
      <div className="cards-linha">
        <CardEstatistica titulo="Músicas" valor={estatisticas.totalMusicas} />
        <CardEstatistica titulo="Links" valor={estatisticas.totalLinks} />
        <CardEstatistica titulo="Total" valor={estatisticas.total} />
      </div>

      <div className="graficos-linha">
        <GraficoRosca titulo="Artista" dados={dadosArtista} />
        <GraficoRosca titulo="Gênero" dados={dadosGenero} />
      </div>
    </div>
  );
}
