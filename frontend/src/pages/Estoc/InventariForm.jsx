import { useState } from 'react';
import { ajustStock, sortidaStock } from '../../api/stock';
import styles from './Inventari.module.css';

export default function InventariForm({ producte, mode, onClose, onSuccess }) {
  const [quantitat, setQuantitat] = useState('');
  const [motiu, setMotiu]         = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async () => {
    const q = parseFloat(quantitat);
    if (!q || q === 0) { setError('Introdueix una quantitat vàlida.'); return; }
    if (mode === 'sortida' && q < 0) { setError('La quantitat ha de ser positiva.'); return; }

    setLoading(true);
    setError('');
    try {
      if (mode === 'ajust') {
        await ajustStock({ producte_id: producte.id, quantitat: q, motiu });
      } else {
        await sortidaStock({ producte_id: producte.id, quantitat: q, motiu });
      }
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message ?? 'Error en realitzar l\'operació.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>
          {mode === 'ajust' ? 'Ajust d\'estoc' : 'Sortida d\'estoc'}
        </h2>
        <p className={styles.modalSub}>
          <strong>{producte.nom}</strong> — estoc actual: {producte.estoc_actual} {producte.unitat_mesura}
        </p>

        <label className={styles.label}>
          Quantitat {mode === 'ajust' ? '(negatiu per reduir)' : ''}
        </label>
        <input
          type="number"
          className={styles.input}
          value={quantitat}
          onChange={e => setQuantitat(e.target.value)}
          placeholder={mode === 'ajust' ? 'ex: -5 o 10' : 'ex: 5'}
          step="0.001"
        />

        <label className={styles.label}>Motiu (opcional)</label>
        <input
          type="text"
          className={styles.input}
          value={motiu}
          onChange={e => setMotiu(e.target.value)}
          placeholder={mode === 'ajust' ? 'Regularització, error...' : 'Consum directe, pèrdua...'}
        />

        {error && <p className={styles.errorMsg}>{error}</p>}

        <div className={styles.modalActions}>
          <button className={styles.btnSecundari} onClick={onClose} disabled={loading}>
            Cancel·lar
          </button>
          <button
            className={mode === 'ajust' ? styles.btnAjust : styles.btnSortida}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardant...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}