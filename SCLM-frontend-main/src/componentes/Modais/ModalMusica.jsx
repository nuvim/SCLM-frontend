import { useState } from 'react';
import ModalBase from './ModalBase';
import toast from 'react-hot-toast';

export default function ModalMusica({ isOpen, onClose, aoSalvar }) {
  const [titulo, setTitulo] = useState('');
  const [artistas, setArtistas] = useState(['']);
  const [genero, setGenero] = useState('');
  const [duracao, setDuracao] = useState('');
  const [download, setDownload] = useState(false);

  const tratarSalvar = () => {
    if (!titulo) { toast('Título obrigatório', { icon: '⚠️' }); return; }
    if (artistas.every(a => !a.trim())) { toast('Deve ter pelo menos um artista', { icon: '⚠️' }); return; }
    
    if (aoSalvar) aoSalvar({ titulo, artistas, genero, duracao, download });
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <span className="material-icons modal-watermark">music_note</span>
      
      <div className="modal-form">
        <input 
          className="modal-input" 
          placeholder="Título" 
          value={titulo} 
          onChange={e => setTitulo(e.target.value)} 
        />
        
        {artistas.map((artista, index) => (
          <div className="linha-artista" key={index}>
            <input 
              className="modal-input" 
              placeholder="Artista" 
              value={artista} 
              onChange={e => {
                const novos = [...artistas];
                novos[index] = e.target.value;
                setArtistas(novos);
              }} 
            />
            {index === 0 && (
              <button 
                className="btn-add-linha" 
                onClick={() => setArtistas([...artistas, ''])}
                title="Adicionar mais um artista"
              >
                +
              </button>
            )}
          </div>
        ))}

        <input 
          className="modal-input" 
          placeholder="Gênero" 
          value={genero} 
          onChange={e => setGenero(e.target.value)} 
        />
        
        <div className="linha-inferior">
          <input 
            className="modal-input input-curto" 
            placeholder="00:00" 
            value={duracao} 
            onChange={e => setDuracao(e.target.value)} 
          />
          <label className="checkbox-personalizado">
            <input 
              type="checkbox" 
              checked={download} 
              onChange={e => setDownload(e.target.checked)} 
            />
            <span>Download?</span>
          </label>
        </div>

        <div className="modal-acoes-rodape">
          <button className="btn-modal-rodape" onClick={tratarSalvar} title="Salvar">
            <span className="material-icons">save</span>
          </button>
          <button className="btn-modal-rodape" onClick={onClose} title="Cancelar">
            <span className="material-icons">close</span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
