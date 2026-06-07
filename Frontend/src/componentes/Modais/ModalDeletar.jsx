import { useState } from 'react';
import ModalBase from './ModalBase';
import toast from 'react-hot-toast';

export default function ModalDeletar({ isOpen, onClose, aoConfirmar, nomeItem }) {
  const tratarConfirmar = () => {
    if (aoConfirmar) aoConfirmar();
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <span className="material-icons modal-watermark" style={{ color: 'var(--cor-erro)', opacity: 0.1 }}>delete</span>
      
      <div className="modal-form">
        <p className="modal-deletar-texto">
          Tem certeza que deseja deletar &quot;{nomeItem || 'este item'}&quot;?
        </p>

        <div className="modal-acoes-rodape">
          <button className="btn-modal-rodape" onClick={tratarConfirmar} title="Sim, deletar" style={{ borderColor: 'var(--cor-erro)' }}>
            <span className="material-icons" style={{ color: 'var(--cor-erro)' }}>check</span>
          </button>
          <button className="btn-modal-rodape" onClick={onClose} title="Cancelar">
            <span className="material-icons">close</span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
