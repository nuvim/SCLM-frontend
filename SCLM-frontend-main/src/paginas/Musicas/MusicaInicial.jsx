import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import CardNavegacao from '../../componentes/CardNavegacao/CardNavegacao';
import BotaoAcaoFlutuante from '../../componentes/BotaoAcaoFlutuante/BotaoAcaoFlutuante';
import ModalMusica from '../../componentes/Modais/ModalMusica';
import ModalDeletar from '../../componentes/Modais/ModalDeletar';
import ModalExportar from '../../componentes/Modais/ModalExportar';
import { ContextoExportar } from '../../contextos/ContextoExportar';
import { musicas as musicasApi } from '../../servicos/api';
import './Musicas.css';

export default function MusicaInicial() {
  const [musicas, setMusicas] = useState([]);
  const [modalAddAberto, setModalAddAberto] = useState(false);
  const [modalDeletarAberto, setModalDeletarAberto] = useState(false);
  const [musicaAtiva, setMusicaAtiva] = useState(null);
  const { modalExportarAberto, setModalExportarAberto } = useContext(ContextoExportar);

  useEffect(() => {
    carregarMusicas();
  }, []);

  const carregarMusicas = async () => {
    try {
      const dados = await musicasApi.listar();
      // a api retorna "titulo", mas o componente usa "nome" — normaliza aqui
      setMusicas(dados.map(m => ({ ...m, nome: m.titulo })));
    } catch (erro) {
      toast.error('Erro ao carregar músicas.');
      console.error(erro);
    }
  };

  const tratarSalvar = async (dados) => {
    try {
      if (musicaAtiva) {
        await musicasApi.atualizar(musicaAtiva.id, {
          titulo: dados.nome || dados.titulo,
          artista: dados.artista,
          url: dados.url,
          plataforma: dados.plataforma,
        });
        toast.success('Música atualizada');
      } else {
        await musicasApi.criar({
          titulo: dados.nome || dados.titulo,
          artista: dados.artista,
          url: dados.url,
          plataforma: dados.plataforma,
        });
        toast.success('Música adicionada');
      }
      setModalAddAberto(false);
      carregarMusicas();
    } catch (erro) {
      toast.error(erro.message || 'Erro ao salvar música.');
    }
  };

  const tratarDeletar = async () => {
    try {
      await musicasApi.deletar(musicaAtiva.id);
      toast.success('Música deletada com sucesso');
      setModalDeletarAberto(false);
      carregarMusicas();
    } catch (erro) {
      toast.error(erro.message || 'Erro ao deletar música.');
    }
  };

  return (
    <div className="pagina-inicial-container">
      <div className="lista-container-branco">
        <div className="cards-navegacao-wrapper">
          <CardNavegacao icone="music_note" rota="/musicas" />
          <CardNavegacao texto="HTTP" rota="/links" />
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
                <h3>{musica.nome}</h3>
                <p>{musica.artista}</p>
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
        musicaInicial={musicaAtiva}
      />

      <ModalDeletar
        isOpen={modalDeletarAberto}
        onClose={() => setModalDeletarAberto(false)}
        aoConfirmar={tratarDeletar}
        nomeItem={musicaAtiva?.nome}
      />

      <ModalExportar
        isOpen={modalExportarAberto}
        onClose={() => setModalExportarAberto(false)}
        totalItens={musicas.length}
      />
    </div>
  );
}
