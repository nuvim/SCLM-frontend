import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import CardNavegacao from '../../componentes/CardNavegacao/CardNavegacao';
import BotaoAcaoFlutuante from '../../componentes/BotaoAcaoFlutuante/BotaoAcaoFlutuante';
import ModalMusica from '../../componentes/Modais/ModalMusica';
import ModalDeletar from '../../componentes/Modais/ModalDeletar';
import { buscarMusicas } from '../../servicos/dadosFake';
import ModalExportar from '../../componentes/Modais/ModalExportar';
import { ContextoExportar } from '../../contextos/ContextoExportar';
import './Musicas.css';

export default function MusicaInicial() {
  const [musicas, setMusicas] = useState([]);

  useEffect(() => {
    // >>> BACKEND: trocar por GET /api/musicas <<<
    const carregarMusicas = async () => {
      const dados = await buscarMusicas();
      setMusicas(dados);
    };
    carregarMusicas();
  }, []);

  const [modalAddAberto, setModalAddAberto] = useState(false);
  const [modalDeletarAberto, setModalDeletarAberto] = useState(false);
  const [musicaAtiva, setMusicaAtiva] = useState(null);
  const { modalExportarAberto, setModalExportarAberto } = useContext(ContextoExportar);

  const tratarSalvar = (/* dados */) => {
    // >>> BACKEND: trocar por POST/PUT /api/musicas <<<
    toast.success('Música adicionada');
  };

  const tratarDeletar = () => {
    // >>> BACKEND: trocar por DELETE /api/musicas/:id <<<
    toast.success('Música deletada com sucesso'); // adiciona
    setModalDeletarAberto(false);
  };

  return (
    <div className="pagina-inicial-container">
      <div className="lista-container-branco">
        <div className="cards-navegacao-wrapper">
          <CardNavegacao
            icone="music_note"
            rota="/musicas"
          />
          <CardNavegacao
            texto="HTTP"
            rota="/links"
          />
        </div>

        <h1 className="lista-titulo">Lista de Músicas</h1>

        <div className="lista-itens">
          {musicas.map(musica => (
            <div key={musica.id} className="item-card">
              <div className="item-icone-container">
                <div className="item-icone-circulo">
                  <span className="material-icons">music_note</span>
                </div>
              </div>
              <div className="item-separador"></div>
              <div className="item-conteudo">
                <h3>{musica.nome}</h3>      {/* era musica.titulo */}
                <p>{musica.artista}</p>     {/* era musica.artistas */}
              </div>
              <div className="item-acoes">
                <button className="btn-acao" title="Editar" onClick={() => { setMusicaAtiva(musica); setModalAddAberto(true); }}>
                  <span className="material-icons">edit</span>
                </button>
                <button className="btn-acao" title="Deletar" onClick={() => { setMusicaAtiva(musica); setModalDeletarAberto(true); }}>
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BotaoAcaoFlutuante
        onClick={() => { setMusicaAtiva(null); setModalAddAberto(true); }}
        icone1="music_note"
        icone2="add"
      />

      <ModalMusica
        isOpen={modalAddAberto}
        onClose={() => setModalAddAberto(false)}
        aoSalvar={tratarSalvar}
      // se formos editar passariamos os dados da musicaAtiva aqui
      />

      <ModalDeletar
        isOpen={modalDeletarAberto}
        onClose={() => setModalDeletarAberto(false)}
        aoConfirmar={tratarDeletar}
        nomeItem={musicaAtiva?.titulo}
      />

      <ModalExportar
        isOpen={modalExportarAberto}
        onClose={() => setModalExportarAberto(false)}
        totalItens={musicas.length}
      />
    </div>
  );
}
