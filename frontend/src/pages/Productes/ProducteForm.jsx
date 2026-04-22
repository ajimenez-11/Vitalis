import { useState } from 'react';
import { parseApiError } from '../../utils/apiError';
import styles from './Productes.module.css';

const UNITATS = ['kg', 'g', 'l', 'ml', 'u', 'bossa', 'caixa', 'pot'];

export default function ProducteForm({ producte, onSave, onCancel }) {
  const editant = producte !== null;

  const [form, setForm] = useState({
    nom:           producte?.nom           ?? '',
    unitat_mesura: producte?.unitat_mesura ?? 'kg',
    estoc_actual:  producte?.estoc_actual  ?? '',
    estoc_minim:   producte?.estoc_minim   ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.nom.trim()) { setError('El nom és obligatori'); return; }
    if (!form.unitat_mesura.trim()) { setError('La unitat de mesura és obligatòria'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>
          {editant ? `Editar: ${producte.nom}` : 'Nou producte'}
        </h2>

        {error && <p className={styles.formError}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Nom *</label>
          <input
            name="nom"
            value={form.nom}
            onChange={handle}
            className={styles.input}
            placeholder="Ex: Farina de blat"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Unitat de mesura *</label>
          <select
            name="unitat_mesura"
            value={form.unitat_mesura}
            onChange={handle}
            className={styles.input}
          >
            {UNITATS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Estoc actual</label>
            <input
              name="estoc_actual"
              type="number"
              min="0"
              step="0.01"
              value={form.estoc_actual}
              onChange={handle}
              className={styles.input}
              placeholder="0"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Estoc mínim</label>
            <input
              name="estoc_minim"
              type="number"
              min="0"
              step="0.01"
              value={form.estoc_minim}
              onChange={handle}
              className={styles.input}
              placeholder="0"
            />
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.btnSecondary}
            onClick={onCancel}
            disabled={saving}
          >
            Cancel·lar
          </button>
          <button
            className={styles.btnPrimary}
            onClick={submit}
            disabled={saving}
          >
            {saving ? 'Desant…' : editant ? 'Desar canvis' : 'Crear producte'}
          </button>
        </div>
      </div>
    </div>
  );
}