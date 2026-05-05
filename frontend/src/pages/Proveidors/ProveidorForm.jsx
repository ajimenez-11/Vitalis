import { useState } from 'react';
import { parseApiError } from '../../utils/apiError';
import { Button, FormField, Modal } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';
import styles from './Proveidors.module.css';

export default function ProveidorForm({ proveidor, onSave, onCancel }) {
  const editant = proveidor !== null;
  const [form, setForm] = useState({
    nom: proveidor?.nom ?? '',
    nif: proveidor?.nif ?? '',
    telefon: proveidor?.telefon ?? '',
    email: proveidor?.email ?? '',
    adreca: proveidor?.adreca ?? '',
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
    <Modal
      title={editant ? `Editar: ${proveidor.nom}` : 'Nou proveïdor'}
      onClose={onCancel}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            Cancel·lar
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Desant…' : editant ? 'Desar canvis' : 'Crear proveïdor'}
          </Button>
        </>
      }
    >
      {error && <div className={styles.formError}>{error}</div>}

      <FormField label="Nom *">
        <input name="nom" value={form.nom} onChange={handle}
          className={inputStyles.input} placeholder="Ex: Distribucions Martí" />
      </FormField>

      <div className={styles.row}>
        <FormField label="NIF">
          <input name="nif" value={form.nif} onChange={handle}
            className={inputStyles.input} placeholder="B12345678" />
        </FormField>
        <FormField label="Telèfon">
          <input name="telefon" value={form.telefon} onChange={handle}
            className={inputStyles.input} placeholder="93 123 45 67" />
        </FormField>
      </div>

      <FormField label="Email">
        <input name="email" type="email" value={form.email} onChange={handle}
          className={inputStyles.input} placeholder="contacte@proveidor.cat" />
      </FormField>

      <FormField label="Adreça">
        <input name="adreca" value={form.adreca} onChange={handle}
          className={inputStyles.input} placeholder="Carrer Exemple, 1 — Barcelona" />
      </FormField>
    </Modal>
  );
}