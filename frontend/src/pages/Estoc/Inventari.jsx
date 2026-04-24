import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getStock } from '../../api/stock';
import { useAuth } from '../../context/AuthContext';
import InventariForm from './InventariForm';   // ← nuevo import
import styles from './Inventari.module.css';

const EstocBadge = ({ baix }) => (
  <span className={baix ? styles.badgeBaix : styles.badgeOk}>
    {baix ? '⚠ Baix mínim' : '✓ OK'}
  </span>
);

export default function InventariPage() {
  const { canWrite } = useAuth();
  const { data: productes, loading, error, refetch } = useApi(getStock);

  const [filtre, setFiltre] = useState('tots');
  const [cerca, setCerca]   = useState('');
  const [modal, setModal]   = useState(null);   // { producte, mode }

  const llista = (productes ?? []).filter(p => {
    const matchFiltre = filtre === 'tots' || (filtre === 'baix' && p.baix_minim);
    const matchCerca  = p.nom.toLowerCase().includes(cerca.toLowerCase());
    return matchFiltre && matchCerca;
  });

  const totalBaix = (productes ?? []).filter(p => p.baix_minim).length;

  if (loading) return <p className={styles.info}>Carregant estoc...</p>;
  if (error)   return <p className={styles.errorMsg}>{error}</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventari</h1>
        {totalBaix > 0 && (
          <span className={styles.alertBanner}>
            ⚠ {totalBaix} producte{totalBaix > 1 ? 's' : ''} per sota del mínim
          </span>
        )}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filtreRow}>
          {['tots', 'baix'].map(f => (
            <button
              key={f}
              className={`${styles.filtreBtn} ${filtre === f ? styles.filtreBtnActive : ''}`}
              onClick={() => setFiltre(f)}
            >
              {f === 'tots' ? 'Tots' : `Baix mínim (${totalBaix})`}
            </button>
          ))}
        </div>
        <input
          type="text"
          className={styles.cerca}
          placeholder="Cercar producte..."
          value={cerca}
          onChange={e => setCerca(e.target.value)}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producte</th>
              <th>Unitat</th>
              <th>Estoc actual</th>
              <th>Estoc mínim</th>
              <th>Estat</th>
              {canWrite && <th>Accions</th>}
            </tr>
          </thead>
          <tbody>
            {llista.length === 0 ? (
              <tr>
                <td colSpan={canWrite ? 6 : 5} className={styles.empty}>Sense resultats.</td>
              </tr>
            ) : llista.map(p => (
              <tr key={p.id} className={p.baix_minim ? styles.rowBaix : ''}>
                <td className={styles.nomProducte}>{p.nom}</td>
                <td>{p.unitat_mesura}</td>
                <td className={p.baix_minim ? styles.stockBaix : styles.stockOk}>{p.estoc_actual}</td>
                <td>{p.estoc_minim}</td>
                <td><EstocBadge baix={p.baix_minim} /></td>
                {canWrite && (
                  <td>
                    <div className={styles.accions}>
                      <button className={styles.btnAjust} onClick={() => setModal({ producte: p, mode: 'ajust' })}>
                        Ajust
                      </button>
                      <button className={styles.btnSortida} onClick={() => setModal({ producte: p, mode: 'sortida' })}>
                        Sortida
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <InventariForm
          producte={modal.producte}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}