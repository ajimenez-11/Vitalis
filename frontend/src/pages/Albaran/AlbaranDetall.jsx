import { useState, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAlbaran, createLinia, deleteLinia, createLot, deleteLot } from '../../api/albarans';
import { getProductes } from '../../api/productes';
import { parseApiError } from '../../utils/apiError';
import { Badge, Button, FormField, PageHeader } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';
import styles from './Albarans.module.css';

export default function AlbaranDetall({ albaran: inicial, onBack, onConfirmar, onEsborrany, canWrite }) {
  const { data: alb, refetch } = useApi(useCallback(() => getAlbaran(inicial.id), [inicial.id]));
  const { data: productes } = useApi(getProductes);

  const [linia, setLinia] = useState({ producte_id: '', quantitat: '', preu_unitari: '' });
  const [lot, setLot] = useState({ numero_lot: '', data_caducitat: '', quantitat: '' });
  const [lotObert, setLotObert] = useState(null);
  const [error, setError] = useState(null);
  const [guardant, setGuardant] = useState(false);

  const albaran = alb ?? inicial;
  const esEsborrany = albaran.estat === 'esborrany';
  const linies = albaran.linies ?? [];

  const afegirLinia = async () => {
    if (!linia.producte_id || !linia.quantitat) { setError('Selecciona producte i quantitat'); return; }
    setGuardant(true); setError(null);
    try {
      await createLinia(albaran.id, linia);
      setLinia({ producte_id: '', quantitat: '', preu_unitari: '' });
      refetch();
    } catch (e) { setError(parseApiError(e)); }
    finally { setGuardant(false); }
  };

  const eliminarLinia = async (id) => {
    if (!window.confirm('Eliminar aquesta línia?')) return;
    setError(null);
    try { await deleteLinia(id); refetch(); }
    catch (e) { setError(parseApiError(e)); }
  };

  const afegirLot = async (liniaId) => {
    if (!lot.numero_lot || !lot.data_caducitat || !lot.quantitat) { setError('Omple tots els camps del lot'); return; }
    setGuardant(true); setError(null);
    try {
      await createLot(liniaId, lot);
      setLot({ numero_lot: '', data_caducitat: '', quantitat: '' });
      setLotObert(null);
      refetch();
    } catch (e) { setError(parseApiError(e)); }
    finally { setGuardant(false); }
  };

  const eliminarLot = async (liniaId, lotId) => {
    setError(null);
    try { await deleteLot(liniaId, lotId); refetch(); }
    catch (e) { setError(parseApiError(e)); }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={`Albaran #${albaran.id}`}
        subtitle={
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {albaran.proveidor?.nom ?? '—'} ·{' '}
            {new Date(albaran.data).toLocaleDateString('ca-ES')} ·{' '}
            <Badge variant={albaran.estat === 'confirmat' ? 'success' : 'warning'}>
              {albaran.estat}
            </Badge>
          </span>
        }
        action={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button variant="ghost" onClick={onBack}>← Tornar</Button>
            {canWrite && esEsborrany && (
              <Button onClick={() => onConfirmar(albaran.id)}>✓ Confirmar albaran</Button>
            )}
            {canWrite && !esEsborrany && (
              <Button variant="warning" onClick={() => onEsborrany(albaran.id)}>
                Revertir a esborrany
              </Button>
            )}
          </div>
        }
      />

      {error && <div className={styles.pageError}>{error}</div>}

      <section className={styles.seccio}>
        <h2 className={styles.seccioTitol}>Línies de l'albaran</h2>

        {linies.length === 0 && (
          <p className={styles.empty}>Cap línia. Afegeix productes a continuació.</p>
        )}

        {linies.map((l) => (
          <div key={l.id} className={styles.liniaCard}>
            <div className={styles.liniaHeader}>
              <span className={styles.liniaNom}>{l.producte?.nom ?? '—'}</span>
              <span className={styles.liniaInfo}>
                {l.quantitat} {l.producte?.unitat_mesura}
                {l.preu_unitari ? ` · ${l.preu_unitari} €/u` : ''}
              </span>
              {canWrite && esEsborrany && (
                <Button variant="danger" size="sm" onClick={() => eliminarLinia(l.id)}>✕</Button>
              )}
            </div>

            <div className={styles.lots}>
              {(l.lots ?? []).length === 0 && <p className={styles.lotsEmpty}>Cap lot assignat</p>}

              {(l.lots ?? []).map((lt) => (
                <div key={lt.id} className={styles.lotItem}>
                  <span>Lot <strong>{lt.numero_lot}</strong></span>
                  <span>Caducitat: {new Date(lt.data_caducitat).toLocaleDateString('ca-ES')}</span>
                  <span>{lt.quantitat} {l.producte?.unitat_mesura}</span>
                  {canWrite && esEsborrany && (
                    <Button variant="danger" size="sm" onClick={() => eliminarLot(l.id, lt.id)}>✕</Button>
                  )}
                </div>
              ))}

              {canWrite && esEsborrany && (
                lotObert === l.id ? (
                  <div className={styles.lotForm}>
                    <input
                      placeholder="Núm. lot"
                      value={lot.numero_lot}
                      onChange={(e) => setLot(p => ({ ...p, numero_lot: e.target.value }))}
                      className={inputStyles.input}
                      style={{ flex: 1, minWidth: 100 }}
                    />
                    <input
                      type="date"
                      value={lot.data_caducitat}
                      onChange={(e) => setLot(p => ({ ...p, data_caducitat: e.target.value }))}
                      className={inputStyles.input}
                      style={{ flex: 1, minWidth: 130 }}
                    />
                    <input
                      type="number"
                      placeholder="Quantitat"
                      value={lot.quantitat}
                      onChange={(e) => setLot(p => ({ ...p, quantitat: e.target.value }))}
                      className={inputStyles.input}
                      style={{ flex: 1, minWidth: 90 }}
                      min="0"
                      step="0.01"
                    />
                    <Button size="sm" onClick={() => afegirLot(l.id)} disabled={guardant}>Afegir</Button>
                    <Button variant="secondary" size="sm" onClick={() => { setLotObert(null); setLot({ numero_lot: '', data_caducitat: '', quantitat: '' }); }}>
                      Cancel·lar
                    </Button>
                  </div>
                ) : (
                  <button className={styles.btnAddLot} onClick={() => { setLotObert(l.id); setError(null); }}>
                    + Afegir lot
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </section>

      {canWrite && esEsborrany && (
        <section className={styles.seccio}>
          <h2 className={styles.seccioTitol}>Afegir línia</h2>
          <div className={styles.liniaFormRow}>
            <select
              value={linia.producte_id}
              onChange={(e) => setLinia(p => ({ ...p, producte_id: e.target.value }))}
              className={inputStyles.input}
            >
              <option value="">— Producte —</option>
              {(productes ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.nom} ({p.unitat_mesura})</option>
              ))}
            </select>
            <input
              type="number" placeholder="Quantitat" min="0" step="0.01"
              value={linia.quantitat}
              onChange={(e) => setLinia(p => ({ ...p, quantitat: e.target.value }))}
              className={inputStyles.input}
            />
            <input
              type="number" placeholder="Preu unit. (opcional)" min="0" step="0.01"
              value={linia.preu_unitari}
              onChange={(e) => setLinia(p => ({ ...p, preu_unitari: e.target.value }))}
              className={inputStyles.input}
            />
            <Button onClick={afegirLinia} disabled={guardant}>
              {guardant ? '…' : 'Afegir'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}