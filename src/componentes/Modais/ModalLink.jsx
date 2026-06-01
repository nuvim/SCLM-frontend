import { useState } from 'react';
import ModalBase from './ModalBase';

export default function ModalLink({ isOpen, onClose, aoSalvar }) {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [categoria, setCategoria] = useState('');

  const tratarSalvar = () => {
    if (aoSalvar) aoSalvar({ titulo, url, categoria: categoria || 'Sem Categoria' });
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <span className="material-icons modal-watermark" style={{ fontSize: '150px' }}>link</span>
      
      <div className="modal-form">
        <input 
          className="modal-input" 
          placeholder="Título" 
          value={titulo} 
          onChange={e => setTitulo(e.target.value)} 
        />
        
        <input 
          className="modal-input" 
          placeholder="URL" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
        />

        <input 
          className="modal-input" 
          placeholder="Categoria (ex: IA's)" 
          value={categoria} 
          onChange={e => setCategoria(e.target.value)} 
        />

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
