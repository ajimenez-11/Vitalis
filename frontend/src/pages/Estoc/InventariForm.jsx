import { useState } from 'react';
import { ajustStock, sortidaStock } from '../../api/stock';
import { Button, FormField, Modal } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';

export default function InventariForm({ producte, mode, onClose, onSuccess }) {
  const [quantitat, setQuantitat] = useState('');
  const [motiu, setMotiu] = useState('');
  const [error, setError] = useState('');
  const [guardant, setGuardant] = useState(false);

  const enviar = async () => {
    const q = parseFloat(quantitat);
    if (!q || q === 0) { setError('Introdueix una quantitat vàlida.'); return; }
    if (mode === 'sortida' && q < 0) { setError('La quantitat ha de ser positiva.'); return; }
    setGuardant(true);
    setError('');
    try {
      if (mode === 'ajust') await ajustStock({ producte_id: producte.id, quantitat: q, motiu });
      else                  await sortidaStock({ producte_id: producte.id, quantitat: q, motiu });
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message ?? "Error en realitzar l'operació.");
    } finally {
      setGuardant(false);
    }
  };

  return (
    <Modal
      title={mode === 'ajust' ? "Ajust d'estoc" : "Sortida d'estoc"}
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} disabled={guardant}>Cancel·lar</Button>
          <Button variant={mode === 'ajust' ? 'warning' : 'danger'} onClick={enviar} disabled={guardant}>
            {guardant ? 'Guardant...' : 'Confirmar'}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
        <strong style={{ color: 'var(--color-text)' }}>{producte.nom}</strong>
        {' '}— estoc actual: {producte.estoc_actual} {producte.unitat_mesura}
      </p>
      <FormField label={`Quantitat${mode === 'ajust' ? ' (negatiu per reduir)' : ''}`} error={error}>
        <input
          type="number"
          className={inputStyles.input}
          value={quantitat}
          onChange={(e) => setQuantitat(e.target.value)}
          placeholder={mode === 'ajust' ? 'ex: -5 o 10' : 'ex: 5'}
          step="0.001"
        />
      </FormField>
      <FormField label="Motiu (opcional)">
        <input
          type="text"
          className={inputStyles.input}
          value={motiu}
          onChange={(e) => setMotiu(e.target.value)}
          placeholder={mode === 'ajust' ? 'Regularització, error...' : 'Consum directe, pèrdua...'}
        />
      </FormField>
    </Modal>
  );
}