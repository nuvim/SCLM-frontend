import { useState } from 'react';
import ModalBase from './ModalBase';
import toast from 'react-hot-toast';

export default function ModalExportar({ isOpen, onClose, totalItens = 0 }) {
  const [formato, setFormato] = useState('');
  const [progresso, setProgresso] = useState(0);
  const [exportando, setExportando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const semItens = totalItens === 0;

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
        toast.success('Arquivo exportado com sucesso');
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

        

        {semItens && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            border: '1px solid #ef4444',
            borderRadius: 'var(--raio-borda)',
            color: '#ef4444',
            fontSize: '0.9rem'
          }}>
            <span className="material-icons-outlined" style={{ fontSize: '1.2rem' }}>error_outline</span>
            Não é possível exportar 0 itens
          </div>
        )}

        {!exportando ? (
          <>
            <select
              className="modal-input"
              value={formato}
              onChange={e => setFormato(e.target.value)}
              disabled={semItens}   // <- desabilita o select também
            >
              <option value="">Selecione</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>

            <button className="btn-primario" onClick={tratarExportar} disabled={!formato || semItens}>
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