import { useState } from 'react';
import { parseApiError } from '../../utils/apiError';
import styles from './Usuaris.module.css';

export default function UsuariForm({ usuari, onSave, onCancel }) {
  const isEdit = !!usuari;
  const [form, setForm] = useState({
    nom: usuari?.nom ?? '',
    email: usuari?.email ?? '',
    password: '',
    rol: usuari?.rol ?? 'cuiner',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Si editamos y el password está vacío, no lo enviamos
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{isEdit ? 'Editar Usuari' : 'Nou Usuari'}</h2>
        
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.formError}>{error}</div>}
          
          <div className={styles.field}>
            <label className={styles.label}>Nom complet</label>
            <input name="nom" value={form.nom} onChange={handleChange} required className={styles.input} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className={styles.input} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contrasenya {isEdit && '(deixar buit per no canviar)'}</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required={!isEdit} className={styles.input} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Rol</label>
            <select name="rol" value={form.rol} onChange={handleChange} className={styles.input}>
              <option value="admin">Administrador</option>
              <option value="responsable_cuina">Responsable de Cuina</option>
              <option value="cuiner">Cuiner</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.btnSecondary} disabled={saving}>Cancel·lar</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Guardant...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}