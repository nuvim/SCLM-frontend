import { useState } from 'react';
import ModalBase from './ModalBase';

export default function ModalObservacao({ isOpen, onClose, aoSalvar }) {
  const [observacao, setObservacao] = useState('');

  const tratarSalvar = () => {
    if (aoSalvar) aoSalvar(observacao);
    onClose();
    setObservacao('');
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="modal-form">
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', color: 'var(--cor-texto)' }}>
          Observações
        </h2>

        <textarea
          className="modal-obs-textarea"
          placeholder="Insira sua obs aqui..."
          value={observacao}
          onChange={e => setObservacao(e.target.value)}
        />

        <div className="modal-acoes-rodape">
          <button className="btn-modal-rodape modal-obs-botao" onClick={tratarSalvar} title="Salvar">
            <span className="material-icons-outlined">save</span>
          </button>
          <button className="btn-modal-rodape modal-obs-botao" onClick={onClose} title="Cancelar">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
}