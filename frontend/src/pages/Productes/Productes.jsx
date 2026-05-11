import { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useApi } from '../../hooks/useApi';
import { getProductes, createProducte, updateProducte, deleteProducte } from '../../api/productes';
import { useSortable } from '../../hooks/useSortable';
import { Badge, Button, PageHeader, Table } from '../../components/ui';
import ProducteForm from './ProducteForm';
import styles from './Productes.module.css';

export default function ProductesPage() {
  const { data: productes, loading, error, refetch } = useApi(getProductes);
  const [modal, setModal] = useState(null);
  const [eliminant, setEliminant] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [cerca, setCerca] = useState('');

  const columns = [
    { key: 'nom',          label: 'Nom',         sortable: true },
    { key: 'unitat',       label: 'Unitat',       sortable: true, sortValue: (p) => p.unitat_mesura ?? '' },
    { key: 'estoc_actual', label: 'Estoc actual', sortable: true, sortValue: (p) => Number(p.estoc_actual) },
    { key: 'estoc_minim',  label: 'Estoc mínim',  sortable: true, sortValue: (p) => Number(p.estoc_minim) },
    { key: 'estat',        label: 'Estat',        sortable: true, sortValue: (p) => Number(p.estoc_actual) <= Number(p.estoc_minim) ? 0 : 1 },
    { key: 'accions',      label: 'Accions' },
  ];

  const llista = (productes ?? []).filter(p => p.nom.toLowerCase().includes(cerca.toLowerCase()));
  const { sorted, sortKey, sortDir, handleSort } = useSortable(llista, columns);

  if (loading) return <div className={styles.status}>Carregant productes…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const desar = async (dades) => {
    try {
      if (modal === 'crear') await createProducte(dades);
      else                   await updateProducte(modal.id, dades);
      setModal(null);
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? "Error en desar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('Segur que vols eliminar aquest producte?')) return;
    setEliminant(id);
    setPageError(null);
    try {
      await deleteProducte(id);
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? "No s'ha pogut eliminar el producte");
    } finally {
      setEliminant(null);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Productes"
        subtitle={`${llista.length} producte${llista.length !== 1 ? 's' : ''} al catàleg`}
        action={<Button onClick={() => { setPageError(null); setModal('crear'); }}>+ Nou producte</Button>}
      />

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input type="text" value={cerca} onChange={e => setCerca(e.target.value)} className={styles.searchInput} placeholder="Cercar producte..." />
        </div>
      </div>

      <Table
        columns={columns}
        data={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        emptyMessage={cerca ? 'Cap producte coincideix amb la cerca' : 'Cap producte registrat. Crea el primer!'}
        renderRow={(p) => {
          const sotaMinim = Number(p.estoc_actual) <= Number(p.estoc_minim);
          return (
            <tr key={p.id} className={sotaMinim ? styles.rowAlert : ''}>
              <td className={styles.nom}>{p.nom}</td>
              <td>{p.unitat_mesura}</td>
              <td className={sotaMinim ? styles.alertText : ''}>{p.estoc_actual}</td>
              <td>{p.estoc_minim}</td>
              <td>
                <Badge variant={sotaMinim ? 'danger' : 'success'}>
                  {sotaMinim ? 'Sota mínims' : 'Correcte'}
                </Badge>
              </td>
              <td className={styles.actions}>
                <Button variant="secondary" size="sm" onClick={() => { setPageError(null); setModal(p); }}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => eliminar(p.id)} disabled={eliminant === p.id}>
                  {eliminant === p.id ? '…' : 'Eliminar'}
                </Button>
              </td>
            </tr>
          );
        }}
      />

      {modal !== null && (
        <ProducteForm producte={modal === 'crear' ? null : modal} onSave={desar} onCancel={() => setModal(null)} />
      )}
    </div>
  );
}