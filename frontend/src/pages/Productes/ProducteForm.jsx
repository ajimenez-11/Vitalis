import { useState } from 'react';
import { parseApiError } from '../../utils/apiError';
import { Button, FormField, Modal } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';
import styles from './Productes.module.css';

const UNITATS = ['kg', 'g', 'l', 'ml', 'u', 'bossa', 'caixa', 'pot'];

export default function ProducteForm({ producte, onSave, onCancel }) {
  const editant = producte !== null;
  const [form, setForm] = useState({
    nom: producte?.nom ?? '',
    unitat_mesura: producte?.unitat_mesura ?? 'kg',
    estoc_actual: producte?.estoc_actual ?? '',
    estoc_minim: producte?.estoc_minim ?? '',
  });
  const [guardant, setGuardant] = useState(false);
  const [error, setError] = useState(null);

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const enviar = async () => {
    if (!form.nom.trim()) { setError('El nom és obligatori'); return; }
    if (!form.unitat_mesura.trim()) { setError('La unitat de mesura és obligatòria'); return; }
    setGuardant(true);
    setError(null);
    try {
      await onSave(form);
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setGuardant(false);
    }
  };

  return (
    <Modal
      title={editant ? `Editar: ${producte.nom}` : 'Nou producte'}
      onClose={onCancel}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={guardant}>Cancel·lar</Button>
          <Button onClick={enviar} disabled={guardant}>
            {guardant ? 'Desant…' : editant ? 'Desar canvis' : 'Crear producte'}
          </Button>
        </>
      }
    >
      {error && <div className={styles.formError}>{error}</div>}
      <FormField label="Nom *">
        <input name="nom" value={form.nom} onChange={handle} className={inputStyles.input} placeholder="Ex: Farina de blat" />
      </FormField>
      <FormField label="Unitat de mesura *">
        <select name="unitat_mesura" value={form.unitat_mesura} onChange={handle} className={inputStyles.input}>
          {UNITATS.map((u) => <option key={u}>{u}</option>)}
        </select>
      </FormField>
      <div className={styles.row}>
        <FormField label="Estoc actual">
          <input name="estoc_actual" type="number" min="0" step="0.01" value={form.estoc_actual} onChange={handle} className={inputStyles.input} placeholder="0" />
        </FormField>
        <FormField label="Estoc mínim">
          <input name="estoc_minim" type="number" min="0" step="0.01" value={form.estoc_minim} onChange={handle} className={inputStyles.input} placeholder="0" />
        </FormField>
      </div>
    </Modal>
  );
}