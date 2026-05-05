import { useState, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { getRecepta } from '../../api/receptes';
import { getProductes as getProductesApi } from '../../api/productes';
import {
  createLiniaRecepta,
  updateLiniaRecepta,
  deleteLiniaRecepta,
} from '../../api/receptes';
import { parseApiError } from '../../utils/apiError';
import { Button, PageHeader } from '../../components/ui';
import styles from './Receptes.module.css';

const LINIA_BUIDA = { producte_id: '', quantitat_per_porcio: '', temperatura_coccio: '' };

export default function ReceptaDetall({ recepta: initial, onBack, canWrite }) {
  const fetchRecepta = useCallback(() => getRecepta(initial.id), [initial.id]);
  const { data: rec, refetch } = useApi(fetchRecepta);
  const { data: productes } = useApi(getProductesApi);

  const [novaLinia, setNovaLinia] = useState(LINIA_BUIDA);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [pageError, setPageError] = useState(null);
  const [saving, setSaving] = useState(false);

  const recepta = rec ?? initial;
  const linies = recepta.linies ?? [];

  const handleAfegir = async () => {
    if (!novaLinia.producte_id || !novaLinia.quantitat_per_porcio) {
      setPageError('Selecciona producte i quantitat per porció');
      return;
    }
    setSaving(true);
    setPageError(null);
    try {
      await createLiniaRecepta(recepta.id, novaLinia);
      setNovaLinia(LINIA_BUIDA);
      refetch();
    } catch (e) { setPageError(parseApiError(e)); }
    finally { setSaving(false); }
  };

  const handleStartEdit = (linia) => {
    setEditId(linia.id);
    setEditData({
      producte_id: linia.producte_id,
      quantitat_per_porcio: linia.quantitat_per_porcio,
      temperatura_coccio: linia.temperatura_coccio ?? '',
    });
    setPageError(null);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setPageError(null);
    try {
      await updateLiniaRecepta(editId, editData);
      setEditId(null);
      refetch();
    } catch (e) { setPageError(parseApiError(e)); }
    finally { setSaving(false); }
  };

  const handleEliminar = async (liniaId) => {
    if (!window.confirm('Eliminar aquest ingredient?')) return;
    setPageError(null);
    try {
      await deleteLiniaRecepta(liniaId);
      refetch();
    } catch (e) { setPageError(parseApiError(e)); }
  };

  return (
    <div>
      <PageHeader
        title={recepta.nom}
        subtitle={[
          recepta.porcions_base ? `${recepta.porcions_base} porcions base` : 'Porcions no definides',
          recepta.usuari?.nom ? `Creat per ${recepta.usuari.nom}` : null,
        ].filter(Boolean).join(' · ')}
        action={<Button variant="ghost" onClick={onBack}>← Tornar</Button>}
      />

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      {/* Llista d'ingredients */}
      <section className={styles.seccio}>
        <h2 className={styles.seccioTitol}>Ingredients</h2>

        {linies.length === 0 && (
          <p className={styles.emptySection}>Cap ingredient. Afegeix-ne a continuació.</p>
        )}

        {linies.map(linia =>
          editId === linia.id ? (
            <div key={linia.id} className={styles.liniaCard}>
              <div className={styles.liniaEditRow}>
                <select
                  value={editData.producte_id}
                  onChange={e => setEditData(p => ({ ...p, producte_id: e.target.value }))}
                  className={styles.input}
                >
                  <option value="">— Producte —</option>
                  {(productes ?? []).map(p => (
                    <option key={p.id} value={p.id}>{p.nom} ({p.unitat_mesura})</option>
                  ))}
                </select>
                <input
                  type="number" placeholder="Qttat/porció" min="0" step="0.001"
                  value={editData.quantitat_per_porcio}
                  onChange={e => setEditData(p => ({ ...p, quantitat_per_porcio: e.target.value }))}
                  className={styles.input}
                />
                <input
                  type="number" placeholder="Temp. °C (opcional)"
                  value={editData.temperatura_coccio}
                  onChange={e => setEditData(p => ({ ...p, temperatura_coccio: e.target.value }))}
                  className={styles.input}
                />
                <div className={styles.liniaEditActions}>
                  <Button size="sm" onClick={handleSaveEdit} disabled={saving}>
                    {saving ? '…' : 'Guardar'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditId(null)}>
                    Cancel·lar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div key={linia.id} className={styles.liniaCard}>
              <div className={styles.liniaHeader}>
                <span className={styles.liniaNom}>{linia.producte?.nom ?? '—'}</span>
                <span className={styles.liniaInfo}>
                  {linia.quantitat_per_porcio} {linia.producte?.unitat_mesura} / porció
                  {linia.temperatura_coccio ? ` · ${linia.temperatura_coccio} °C` : ''}
                </span>
                {canWrite && (
                  <div className={styles.liniaAccions}>
                    <Button size="sm" variant="secondary" onClick={() => handleStartEdit(linia)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleEliminar(linia.id)}>
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </section>

      {/* Formulari nova línia */}
      {canWrite && (
        <section className={styles.seccio}>
          <h2 className={styles.seccioTitol}>Afegir ingredient</h2>
          <div className={styles.liniaFormRow}>
            <select
              value={novaLinia.producte_id}
              onChange={e => setNovaLinia(p => ({ ...p, producte_id: e.target.value }))}
              className={styles.input}
            >
              <option value="">— Producte —</option>
              {(productes ?? []).map(p => (
                <option key={p.id} value={p.id}>{p.nom} ({p.unitat_mesura})</option>
              ))}
            </select>
            <input
              type="number" placeholder="Quantitat / porció" min="0" step="0.001"
              value={novaLinia.quantitat_per_porcio}
              onChange={e => setNovaLinia(p => ({ ...p, quantitat_per_porcio: e.target.value }))}
              className={styles.input}
            />
            <input
              type="number" placeholder="Temp. cocció °C (opcional)"
              value={novaLinia.temperatura_coccio}
              onChange={e => setNovaLinia(p => ({ ...p, temperatura_coccio: e.target.value }))}
              className={styles.input}
            />
            <Button onClick={handleAfegir} disabled={saving}>
              {saving ? '…' : 'Afegir'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}