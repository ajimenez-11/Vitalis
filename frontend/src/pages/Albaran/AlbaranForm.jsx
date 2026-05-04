import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getProveidors } from '../../api/proveidors';
import { parseApiError } from '../../utils/apiError';
import { Button, FormField, Modal } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';

export default function AlbaranForm({ onSave, onCancel }) {
  const { data: proveidors } = useApi(getProveidors);
  const [form, setForm] = useState({
    proveidor_id: '',
    data: new Date().toISOString().split('T')[0],
    observacions: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.proveidor_id) { setError('Selecciona un proveïdor'); return; }
    if (!form.data) { setError('La data és obligatòria'); return; }
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
      title="Nou albaran"
      onClose={onCancel}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            Cancel·lar
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Creant…' : 'Crear i afegir línies →'}
          </Button>
        </>
      }
    >
      {error && <div className="formError" style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

      <FormField label="Proveïdor *">
        <select
          name="proveidor_id"
          value={form.proveidor_id}
          onChange={handle}
          className={inputStyles.input}
        >
          <option value="">— Selecciona proveïdor —</option>
          {(proveidors ?? []).map((p) => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Data *">
        <input
          name="data"
          type="date"
          value={form.data}
          onChange={handle}
          className={inputStyles.input}
        />
      </FormField>

      <FormField label="Observacions">
        <textarea
          name="observacions"
          value={form.observacions}
          onChange={handle}
          className={inputStyles.input}
          rows={3}
          placeholder="Notes opcionals…"
        />
      </FormField>
    </Modal>
  );
}