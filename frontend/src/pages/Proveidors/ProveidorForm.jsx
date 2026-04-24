import { useState } from 'react';
import { parseApiError } from '../../utils/apiError';
import styles from './Proveidors.module.css';

export default function ProveidorForm({ proveidor, onSave, onCancel }) {
  const editant = proveidor !== null;

  const [form, setForm] = useState({
    nom:     proveidor?.nom     ?? '',
    nif:     proveidor?.nif     ?? '',
    telefon: proveidor?.telefon ?? '',
    email:   proveidor?.email   ?? '',
    adreca:  proveidor?.adreca  ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.nom.trim()) { setError('El nom és obligatori'); return; }
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
          {editant ? `Editar: ${proveidor.nom}` : 'Nou proveïdor'}
        </h2>

        {error && <p className={styles.formError}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Nom *</label>
          <input name="nom" value={form.nom} onChange={handle}
            className={styles.input} placeholder="Ex: Distribucions Martí" />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>NIF</label>
            <input name="nif" value={form.nif} onChange={handle}
              className={styles.input} placeholder="B12345678" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Telèfon</label>
            <input name="telefon" value={form.telefon} onChange={handle}
              className={styles.input} placeholder="93 123 45 67" />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handle}
            className={styles.input} placeholder="contacte@proveidor.cat" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Adreça</label>
          <input name="adreca" value={form.adreca} onChange={handle}
            className={styles.input} placeholder="Carrer Exemple, 1 — Barcelona" />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onCancel} disabled={saving}>
            Cancel·lar
          </button>
          <button className={styles.btnPrimary} onClick={submit} disabled={saving}>
            {saving ? 'Desant…' : editant ? 'Desar canvis' : 'Crear proveïdor'}
          </button>
        </div>
      </div>
    </div>
  );
}