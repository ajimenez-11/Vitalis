import { useState } from 'react';
import { parseApiError } from '../../utils/apiError';
import { Button, FormField, Modal } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';

export default function UsuariForm({ usuari, onSave, onCancel }) {
  const isEdit = !!usuari;
  const [form, setForm] = useState({
    nom: usuari?.nom ?? '',
    email: usuari?.email ?? '',
    password: '',
    rol: usuari?.rol ?? 'cuiner',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const dataToSend = { ...form };
      if (isEdit && !dataToSend.password) delete dataToSend.password;
      await onSave(dataToSend);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Editar Usuari' : 'Nou Usuari'}
      onClose={onCancel}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            Cancel·lar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardant...' : 'Guardar'}
          </Button>
        </>
      }
    >
      {error && <div style={{
        background: 'var(--color-error-bg)', color: 'var(--color-error)',
        padding: '10px 14px', borderRadius: 'var(--radius-sm)',
        marginBottom: '1rem', fontSize: '0.85rem'
      }}>{error}</div>}

      <FormField label="Nom complet">
        <input name="nom" value={form.nom} onChange={handleChange}
          required className={inputStyles.input} />
      </FormField>

      <FormField label="Email">
        <input name="email" type="email" value={form.email} onChange={handleChange}
          required className={inputStyles.input} />
      </FormField>

      <FormField label={`Contrasenya${isEdit ? ' (deixar buit per no canviar)' : ''}`}>
        <input name="password" type="password" value={form.password} onChange={handleChange}
          required={!isEdit} className={inputStyles.input} />
      </FormField>

      <FormField label="Rol">
        <select name="rol" value={form.rol} onChange={handleChange} className={inputStyles.input}>
          <option value="admin">Administrador</option>
          <option value="responsable_cuina">Responsable de Cuina</option>
          <option value="cuiner">Cuiner</option>
        </select>
      </FormField>
    </Modal>
  );
}