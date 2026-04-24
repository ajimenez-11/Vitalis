import { useState, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { getRecepta } from '../../api/receptes';
import { getProductes } from '../../api/productes';
import {
  createLiniaRecepta,
  updateLiniaRecepta,
  deleteLiniaRecepta,
} from '../../api/receptes';
import { parseApiError } from '../../utils/apiError';
import styles from './Receptes.module.css'; 

const LINIA_BUIDA = { producte_id: '', quantitat_per_porcio: '', temperatura_coccio: '' };

export default function ReceptaDetall({ recepta: initial, onBack, canWrite }) {
  const fetchRecepta = useCallback(() => getRecepta(initial.id), [initial.id]);
  const { data: rec, refetch } = useApi(fetchRecepta);
  const { data: productes } = useApi(getProductes);

  const [novaLinia,  setNovaLinia]  = useState(LINIA_BUIDA);
  const [editId,     setEditId]     = useState(null);   
  const [editData,   setEditData]   = useState({});
  const [pageError,  setPageError]  = useState(null);
  const [saving,     setSaving]     = useState(false);

  const recepta = rec ?? initial;
  const linies  = recepta.linies ?? [];

  // ── Afegir línia 
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
    } catch (e) {
      setPageError(parseApiError(e));
    } finally {
      setSaving(false);
    }
  };

  // ── Editar línia inline 
  const handleStartEdit = (linia) => {
    setEditId(linia.id);
    setEditData({
      producte_id:        linia.producte_id,
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
    } catch (e) {
      setPageError(parseApiError(e));
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar línia 
  const handleEliminar = async (liniaId) => {
    if (!window.confirm('Eliminar aquest ingredient?')) return;
    setPageError(null);
    try {
      await deleteLiniaRecepta(liniaId);
      refetch();
    } catch (e) {
      setPageError(parseApiError(e));
    }
  };

  return (
    <div className={styles.page}>
      {/* Capçalera */}
      <header className={styles.header}>
        <div>
          <button className={styles.btnBack} onClick={onBack}>← Tornar</button>
          <h1 className={styles.title}>{recepta.nom}</h1>
          <p className={styles.subtitle}>
            {recepta.porcions_base
              ? `${recepta.porcions_base} porcions base`
              : 'Porcions no definides'}
            {recepta.usuari?.nom && ` · Creat per ${recepta.usuari.nom}`}
          </p>
        </div>
      </header>

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      {/* Llista d'ingredients */}
      <section className={styles.seccio}>
        <h2 className={styles.seccioTitol}>Ingredients</h2>

        {linies.length === 0 && (
          <p className={styles.empty}>Cap ingredient. Afegeix-ne a continuació.</p>
        )}

        {linies.map((linia) =>
          editId === linia.id ? (
            /* ── Fila en edició ── */
            <div key={linia.id} className={styles.liniaCard}>
              <div className={styles.liniaHeader}>
                <div className={styles.liniaFormRow} style={{ flex: 1 }}>
                  <select
                    value={editData.producte_id}
                    onChange={(e) => setEditData((p) => ({ ...p, producte_id: e.target.value }))}
                    className={styles.input}
                  >
                    <option value="">— Producte —</option>
                    {(productes ?? []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} ({p.unitat_mesura})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Qttat/porció"
                    min="0"
                    step="0.001"
                    value={editData.quantitat_per_porcio}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, quantitat_per_porcio: e.target.value }))
                    }
                    className={styles.input}
                  />

                  <input
                    type="number"
                    placeholder="Temp. cocció (°C, opcional)"
                    value={editData.temperatura_coccio}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, temperatura_coccio: e.target.value }))
                    }
                    className={styles.input}
                  />

                  <button
                    className={styles.btnConfirmSm}
                    onClick={handleSaveEdit}
                    disabled={saving}
                  >
                    Guardar
                  </button>
                  <button
                    className={styles.btnCancelSm}
                    onClick={() => setEditId(null)}
                  >
                    Cancel·lar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Fila normal ── */
            <div key={linia.id} className={styles.liniaCard}>
              <div className={styles.liniaHeader}>
                <span className={styles.liniaNom}>
                  {linia.producte?.nom ?? '—'}
                </span>
                <span className={styles.liniaInfo}>
                  {linia.quantitat_per_porcio} {linia.producte?.unitat_mesura} / porció
                  {linia.temperatura_coccio
                    ? ` · ${linia.temperatura_coccio} °C`
                    : ''}
                </span>
                {canWrite && (
                  <>
                    <button
                      className={styles.btnEdit}
                      onClick={() => handleStartEdit(linia)}
                      style={{ marginLeft: 'auto' }}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnDeleteSm}
                      onClick={() => handleEliminar(linia.id)}
                    >
                      ✕
                    </button>
                  </>
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
              onChange={(e) => setNovaLinia((p) => ({ ...p, producte_id: e.target.value }))}
              className={styles.input}
            >
              <option value="">— Producte —</option>
              {(productes ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({p.unitat_mesura})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantitat / porció"
              min="0"
              step="0.001"
              value={novaLinia.quantitat_per_porcio}
              onChange={(e) =>
                setNovaLinia((p) => ({ ...p, quantitat_per_porcio: e.target.value }))
              }
              className={styles.input}
            />

            <input
              type="number"
              placeholder="Temp. cocció °C (opcional)"
              value={novaLinia.temperatura_coccio}
              onChange={(e) =>
                setNovaLinia((p) => ({ ...p, temperatura_coccio: e.target.value }))
              }
              className={styles.input}
            />

            <button
              className={styles.btnPrimary}
              onClick={handleAfegir}
              disabled={saving}
            >
              {saving ? '…' : 'Afegir'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}