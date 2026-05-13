import { useState } from 'react';
import { parseApiError } from '../../utils/apiError';
import { Button, FormField, Modal } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';

export default function UsuariForm({ usuari, onSave, onCancel }) {
  const editant = !!usuari;
  const [form, setForm] = useState({
    nom: usuari?.nom ?? '',
    email: usuari?.email ?? '',
    password: '',
    rol: usuari?.rol ?? 'cuiner',
  });
  const [guardant, setGuardant] = useState(false);
  const [error, setError] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async () => {
    setGuardant(true);
    setError(null);
    try {
      const dades = { ...form };
      if (editant && !dades.password) delete dades.password;
      await onSave(dades);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setGuardant(false);
    }
  };

  return (
    <Modal
      title={editant ? 'Editar Usuari' : 'Nou Usuari'}
      onClose={onCancel}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={guardant}>Cancel·lar</Button>
          <Button onClick={enviar} disabled={guardant}>
            {guardant ? 'Guardant...' : 'Guardar'}
          </Button>
        </>
      }
    >
      {error && (
        <div style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      <FormField label="Nom complet">
        <input name="nom" value={form.nom} onChange={handle} required className={inputStyles.input} />
      </FormField>
      <FormField label="Email">
        <input name="email" type="email" value={form.email} onChange={handle} required className={inputStyles.input} />
      </FormField>
      <FormField label={`Contrasenya${editant ? ' (deixar buit per no canviar)' : ''}`}>
        <input name="password" type="password" value={form.password} onChange={handle} required={!editant} className={inputStyles.input} />
      </FormField>
      <FormField label="Rol">
        <select name="rol" value={form.rol} onChange={handle} className={inputStyles.input}>
          <option value="admin">Administrador</option>
          <option value="responsable_cuina">Responsable de Cuina</option>
          <option value="cuiner">Cuiner</option>
        </select>
      </FormField>
    </Modal>
  );
}