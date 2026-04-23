import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getProveidors } from '../../api/proveidors';
import { parseApiError } from '../../utils/apiError';
import styles from './Albarans.module.css';

export default function AlbaranForm({ onSave, onCancel }) {
  const { data: proveidors } = useApi(getProveidors);

  const [form, setForm] = useState({
    proveidor_id: '',
    data: new Date().toISOString().split('T')[0],
    observacions: '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.proveidor_id) { setError('Selecciona un proveïdor'); return; }
    if (!form.data)         { setError('La data és obligatòria'); return; }
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
        <h2 className={styles.modalTitle}>Nou albaran</h2>
        {error && <p className={styles.formError}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Proveïdor *</label>
          <select name="proveidor_id" value={form.proveidor_id}
            onChange={handle} className={styles.input}>
            <option value="">— Selecciona proveïdor —</option>
            {(proveidors ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Data *</label>
          <input name="data" type="date" value={form.data}
            onChange={handle} className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Observacions</label>
          <textarea name="observacions" value={form.observacions}
            onChange={handle} className={styles.input}
            rows={3} placeholder="Notes opcionals…" />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onCancel} disabled={saving}>
            Cancel·lar
          </button>
          <button className={styles.btnPrimary} onClick={submit} disabled={saving}>
            {saving ? 'Creant…' : 'Crear i afegir línies →'}
          </button>
        </div>
      </div>
    </div>
  );
}