import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import CardNavegacao from '../../componentes/CardNavegacao/CardNavegacao';
import BotaoAcaoFlutuante from '../../componentes/BotaoAcaoFlutuante/BotaoAcaoFlutuante';
import ModalLink from '../../componentes/Modais/ModalLink';
import ModalDeletar from '../../componentes/Modais/ModalDeletar';
import ModalExportar from '../../componentes/Modais/ModalExportar';
import { ContextoExportar } from '../../contextos/ContextoExportar';
import { buscarLinks } from '../../servicos/dadosFake';
import ModalObservacao from '../../componentes/Modais/ModalObservacao';
import './Links.css';

export default function LinkInicial() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // >>> BACKEND: trocar por GET /api/links <<<
    const carregarLinks = async () => {
      const dados = await buscarLinks();
      setLinks(dados);
    };
    carregarLinks();
  }, []);

  const [modalAddAberto, setModalAddAberto] = useState(false);
  const [modalDeletarAberto, setModalDeletarAberto] = useState(false);
  const [linkAtivo, setLinkAtivo] = useState(null);
  const { modalExportarAberto, setModalExportarAberto } = useContext(ContextoExportar);
  const [modalObsAberto, setModalObsAberto] = useState(false);

  const tratarSalvar = (/* dados */) => {
    // >>> BACKEND: trocar por POST/PUT /api/links <<<
    toast.success('Link adicionado');
  };

  const tratarDeletar = () => {
    // >>> BACKEND: trocar por DELETE /api/links/:id <<<
    toast.success('Link deletado com sucesso'); 
    setModalDeletarAberto(false);
  };

  // agrupando por categoria
  const categorias = links.reduce((acc, link) => {
    if (!acc[link.categoria]) acc[link.categoria] = [];
    acc[link.categoria].push(link);
    return acc;
  }, {});

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

        <h1 className="lista-titulo">Lista de Links</h1>

        <div className="lista-itens">
          {Object.entries(categorias).map(([cat, catLinks]) => (
            <div key={cat} className="categoria-grupo">
              <h2 className="categoria-titulo">{cat}</h2>
              {catLinks.map(link => (
                <div key={link.id} className="item-card">
                  <div className="item-icone-container">
                    <div className="item-icone-circulo">
                      <span className="item-texto-icone">HTTP</span>
                    </div>
                  </div>
                  <div className="item-separador"></div>
                  <div className="item-conteudo">
                    <h3>{link.titulo}</h3>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                  </div>
                  <div className="item-acoes">
                    <button className="btn-acao" onClick={() => { setLinkAtivo(link); setModalAddAberto(true); }}>
                      <span className="material-icons">edit</span>
                    </button>
                    <button className="btn-acao" onClick={() => { setLinkAtivo(link); setModalObsAberto(true); }}>
                      <span className="material-icons">post_add</span>
                    </button>
                    <button className="btn-acao" onClick={() => { setLinkAtivo(link); setModalDeletarAberto(true); }}>
                      <span className="material-icons">delete</span>
                    </button>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn-acao">
                      <span className="material-icons">open_in_new</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <BotaoAcaoFlutuante
        onClick={() => { setLinkAtivo(null); setModalAddAberto(true); }}
        icone1="add"
      />

      <ModalLink
        isOpen={modalAddAberto}
        onClose={() => setModalAddAberto(false)}
        aoSalvar={tratarSalvar}
      />

      <ModalDeletar
        isOpen={modalDeletarAberto}
        onClose={() => setModalDeletarAberto(false)}
        aoConfirmar={tratarDeletar}
        nomeItem={linkAtivo?.titulo}
      />
      <ModalExportar
        isOpen={modalExportarAberto}
        onClose={() => setModalExportarAberto(false)}
        totalItens={links.length}
      />
      <ModalObservacao
        isOpen={modalObsAberto}
        onClose={() => setModalObsAberto(false)}
        aoSalvar={(obs) => {
          // >>> BACKEND: trocar por PATCH /api/links/:id/observacao <
          console.log('obs do link', linkAtivo?.id, ':', obs);
        }}
      />
    </div>
  );
}
