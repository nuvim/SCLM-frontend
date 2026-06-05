import { useState } from 'react';
import ModalBase from './ModalBase';

export default function ModalExportar({ isOpen, onClose }) {
  const [formato, setFormato] = useState('');
  const [progresso, setProgresso] = useState(0);
  const [exportando, setExportando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const tratarExportar = () => {
    if (!formato) return;
    setExportando(true);

    // >>> BACKEND: trocar por chamada real de exportação <
    let atual = 0;
    const intervalo = setInterval(() => {
      atual += 10;
      setProgresso(atual);
      if (atual >= 100) {
        clearInterval(intervalo);
        setConcluido(true);
      }
    }, 200);
  };

  const tratarConcluir = () => {
    onClose();
    setFormato('');
    setProgresso(0);
    setExportando(false);
    setConcluido(false);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={tratarConcluir}>
      <span className="material-icons modal-watermark">file_upload</span>

      <div className="modal-form">
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', color: 'var(--cor-texto)' }}>
          Exportar arquivo
        </h2>

        {!exportando ? (
          <>
            <select
              className="modal-input"
              value={formato}
              onChange={e => setFormato(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>

            <button className="btn-primario" onClick={tratarExportar} disabled={!formato}>
              Exportar
            </button>
          </>
        ) : (
          <>
            <div style={{ width: '100%', background: 'var(--cor-borda)', borderRadius: '999px', height: '12px' }}>
              <div style={{
                width: `${progresso}%`,
                background: '#22c55e',
                height: '12px',
                borderRadius: '999px',
                transition: 'width 0.2s ease'
              }} />
            </div>
            <p style={{ textAlign: 'center', color: 'var(--cor-texto-sec)' }}>{progresso}%</p>

            <button className="btn-primario" onClick={tratarConcluir} disabled={!concluido}>
              Concluir
            </button>
          </>
        )}
      </div>
    </ModalBase>
  );
}