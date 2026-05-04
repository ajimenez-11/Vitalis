import { useState, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAlbaran } from '../../api/albarans';
import {
  createLinia, deleteLinia,
  createLot,   deleteLot,
} from '../../api/albarans';
import { getProductes } from '../../api/productes';
import { parseApiError } from '../../utils/apiError';
import { Badge, Button, FormField, PageHeader } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';
import styles from './Albarans.module.css';

export default function AlbaranDetall({ albaran: initial, onBack, onConfirmar, onEsborrany, canWrite }) {
  const fetchAlbaran = useCallback(() => getAlbaran(initial.id), [initial.id]);
  const { data: alb, refetch } = useApi(fetchAlbaran);
  const { data: productes } = useApi(getProductes);

  const [novaLinia, setNovaLinia] = useState({ producte_id: '', quantitat: '', preu_unitari: '' });
  const [nouLot,    setNouLot]    = useState({ numero_lot: '', data_caducitat: '', quantitat: '' });
  const [lotLiniaId, setLotLiniaId] = useState(null);
  const [pageError,  setPageError] = useState(null);
  const [saving,     setSaving] = useState(false);

  const albaran = alb ?? initial;
  const esEsborrany = albaran.estat === 'esborrany';

  const handleAfegirLinia = async () => {
    if (!novaLinia.producte_id || !novaLinia.quantitat) {
      setPageError('Selecciona producte i quantitat'); return;
    }
    setSaving(true); setPageError(null);
    try {
      await createLinia(albaran.id, novaLinia);
      setNovaLinia({ producte_id: '', quantitat: '', preu_unitari: '' });
      refetch();
    } catch (e) { setPageError(parseApiError(e)); }
    finally     { setSaving(false); }
  };

  const handleEliminarLinia = async (liniaId) => {
    if (!window.confirm('Eliminar aquesta línia?')) return;
    setPageError(null);
    try { await deleteLinia(liniaId); refetch(); }
    catch (e) { setPageError(parseApiError(e)); }
  };

  const handleAfegirLot = async (liniaId) => {
    if (!nouLot.numero_lot || !nouLot.data_caducitat || !nouLot.quantitat) {
      setPageError('Omple tots els camps del lot'); return;
    }
    setSaving(true); setPageError(null);
    try {
      await createLot(liniaId, nouLot);
      setNouLot({ numero_lot: '', data_caducitat: '', quantitat: '' });
      setLotLiniaId(null);
      refetch();
    } catch (e) { setPageError(parseApiError(e)); }
    finally     { setSaving(false); }
  };

  const handleEliminarLot = async (liniaId, lotId) => {
    setPageError(null);
    try { await deleteLot(liniaId, lotId); refetch(); }
    catch (e) { setPageError(parseApiError(e)); }
  };

  const linies = albaran.linies ?? [];

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
              <Button onClick={() => onConfirmar(albaran.id)}>
                ✓ Confirmar albaran
              </Button>
            )}
            {canWrite && !esEsborrany && (
              <Button variant="warning" onClick={() => onEsborrany(albaran.id)}>
                Revertir a esborrany
              </Button>
            )}
          </div>
        }
      />

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      {/* Línies */}
      <section className={styles.seccio}>
        <h2 className={styles.seccioTitol}>Línies de l'albaran</h2>

        {linies.length === 0 && (
          <p className={styles.empty}>Cap línia. Afegeix productes a continuació.</p>
        )}

        {linies.map((linia) => (
          <div key={linia.id} className={styles.liniaCard}>
            <div className={styles.liniaHeader}>
              <span className={styles.liniaNom}>{linia.producte?.nom ?? '—'}</span>
              <span className={styles.liniaInfo}>
                {linia.quantitat} {linia.producte?.unitat_mesura}
                {linia.preu_unitari ? ` · ${linia.preu_unitari} €/u` : ''}
              </span>
              {canWrite && esEsborrany && (
                <Button variant="danger" size="sm" onClick={() => handleEliminarLinia(linia.id)}>✕</Button>
              )}
            </div>

            <div className={styles.lots}>
              {(linia.lots ?? []).length === 0 && (
                <p className={styles.lotsEmpty}>Cap lot assignat</p>
              )}
              {(linia.lots ?? []).map((lot) => (
                <div key={lot.id} className={styles.lotItem}>
                  <span>Lot <strong>{lot.numero_lot}</strong></span>
                  <span>Caducitat: {new Date(lot.data_caducitat).toLocaleDateString('ca-ES')}</span>
                  <span>{lot.quantitat} {linia.producte?.unitat_mesura}</span>
                  {canWrite && esEsborrany && (
                    <Button variant="danger" size="sm" onClick={() => handleEliminarLot(linia.id, lot.id)}>✕</Button>
                  )}
                </div>
              ))}

              {canWrite && esEsborrany && (
                lotLiniaId === linia.id ? (
                  <div className={styles.lotForm}>
                    <input
                      placeholder="Núm. lot"
                      value={nouLot.numero_lot}
                      onChange={(e) => setNouLot(p => ({ ...p, numero_lot: e.target.value }))}
                      className={inputStyles.input}
                      style={{ flex: 1, minWidth: 100 }}
                    />
                    <input
                      type="date"
                      value={nouLot.data_caducitat}
                      onChange={(e) => setNouLot(p => ({ ...p, data_caducitat: e.target.value }))}
                      className={inputStyles.input}
                      style={{ flex: 1, minWidth: 130 }}
                    />
                    <input
                      type="number"
                      placeholder="Quantitat"
                      value={nouLot.quantitat}
                      onChange={(e) => setNouLot(p => ({ ...p, quantitat: e.target.value }))}
                      className={inputStyles.input}
                      style={{ flex: 1, minWidth: 90 }}
                      min="0"
                      step="0.01"
                    />
                    <Button size="sm" onClick={() => handleAfegirLot(linia.id)} disabled={saving}>
                      Afegir
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setLotLiniaId(null);
                        setNouLot({ numero_lot: '', data_caducitat: '', quantitat: '' });
                      }}
                    >
                      Cancel·lar
                    </Button>
                  </div>
                ) : (
                  <button
                    className={styles.btnAddLot}
                    onClick={() => { setLotLiniaId(linia.id); setPageError(null); }}
                  >
                    + Afegir lot
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Formulari nova línia */}
      {canWrite && esEsborrany && (
        <section className={styles.seccio}>
          <h2 className={styles.seccioTitol}>Afegir línia</h2>
          <div className={styles.liniaFormRow}>
            <select
              value={novaLinia.producte_id}
              onChange={(e) => setNovaLinia(p => ({ ...p, producte_id: e.target.value }))}
              className={inputStyles.input}
            >
              <option value="">— Producte —</option>
              {(productes ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.nom} ({p.unitat_mesura})</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantitat"
              min="0"
              step="0.01"
              value={novaLinia.quantitat}
              onChange={(e) => setNovaLinia(p => ({ ...p, quantitat: e.target.value }))}
              className={inputStyles.input}
            />
            <input
              type="number"
              placeholder="Preu unit. (opcional)"
              min="0"
              step="0.01"
              value={novaLinia.preu_unitari}
              onChange={(e) => setNovaLinia(p => ({ ...p, preu_unitari: e.target.value }))}
              className={inputStyles.input}
            />
            <Button onClick={handleAfegirLinia} disabled={saving}>
              {saving ? '…' : 'Afegir'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}