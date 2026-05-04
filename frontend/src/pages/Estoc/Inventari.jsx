import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getStock } from '../../api/stock';
import { useAuth } from '../../context/AuthContext';
import { Badge, Button, PageHeader, Table } from '../../components/ui';
import InventariForm from './InventariForm';
import styles from './Inventari.module.css';

export default function InventariPage() {
  const { canWrite } = useAuth();
  const { data: productes, loading, error, refetch } = useApi(getStock);
  const [filtre, setFiltre] = useState('tots');
  const [cerca, setCerca]   = useState('');
  const [modal, setModal]   = useState(null);

  const llista = (productes ?? []).filter((p) => {
    const matchFiltre = filtre === 'tots' || (filtre === 'baix' && p.baix_minim);
    const matchCerca  = p.nom.toLowerCase().includes(cerca.toLowerCase());
    return matchFiltre && matchCerca;
  });

  const totalBaix = (productes ?? []).filter((p) => p.baix_minim).length;

  if (loading) return <p className={styles.info}>Carregant estoc...</p>;
  if (error)   return <p className={styles.errorMsg}>{error}</p>;

  const columns = [
    { key: 'nom', label: 'Producte' },
    { key: 'unitat', label: 'Unitat' },
    { key: 'estoc_actual', label: 'Estoc actual' },
    { key: 'estoc_minim', label: 'Estoc mínim' },
    { key: 'estat', label: 'Estat' },
    ...(canWrite ? [{ key: 'accions', label: 'Accions' }] : []),
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Inventari"
        subtitle={
          totalBaix > 0
            ? `⚠ ${totalBaix} producte${totalBaix > 1 ? 's' : ''} per sota del mínim`
            : `${(productes ?? []).length} productes`
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.filtreRow}>
          {['tots', 'baix'].map((f) => (
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
          onChange={(e) => setCerca(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={llista}
        emptyMessage="Sense resultats."
        renderRow={(p) => (
          <tr key={p.id} className={p.baix_minim ? styles.rowBaix : ''}>
            <td className={styles.nomProducte}>{p.nom}</td>
            <td>{p.unitat_mesura}</td>
            <td className={p.baix_minim ? styles.stockBaix : styles.stockOk}>
              {p.estoc_actual}
            </td>
            <td>{p.estoc_minim}</td>
            <td>
              <Badge variant={p.baix_minim ? 'warning' : 'success'}>
                {p.baix_minim ? '⚠ Baix mínim' : '✓ OK'}
              </Badge>
            </td>
            {canWrite && (
              <td>
                <div className={styles.accions}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setModal({ producte: p, mode: 'ajust' })}
                  >
                    Ajust
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setModal({ producte: p, mode: 'sortida' })}
                  >
                    Sortida
                  </Button>
                </div>
              </td>
            )}
          </tr>
        )}
      />

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