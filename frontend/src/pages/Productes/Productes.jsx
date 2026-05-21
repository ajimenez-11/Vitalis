import { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import {
  getProductes, createProducte, updateProducte, deleteProducte,
} from '../../api/productes';
import { useSortable } from '../../hooks/useSortable';
import { Badge, Button, DeleteModal, PageHeader, Table } from '../../components/ui';
import ProducteForm from './ProducteForm';
import styles from './Productes.module.css';


export default function ProductesPage() {
  const { canWrite } = useAuth();
  const { data: productes, loading, error, refetch } = useApi(getProductes);
  const [modal, setModal] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [query, setQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); 
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const unitats_mesura_especific = [
    { value: 'u', label: 'Unitats' },
    { value: 'l', label: 'Litres' },
  ]

  const columns = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'unitat', label: 'Unitat', sortable: true, sortValue: (p) => p.unitat_mesura ?? '' },
    { key: 'estoc_actual', label: 'Estoc actual', sortable: true, sortValue: (p) => Number(p.estoc_actual) },
    { key: 'estoc_minim', label: 'Estoc mínim', sortable: true, sortValue: (p) => Number(p.estoc_minim) },
    { key: 'estat', label: 'Estat', sortable: true, sortValue: (p) => Number(p.estoc_actual) <= Number(p.estoc_minim) ? 0 : 1 },
    ...(canWrite ? [{ key: 'accions', label: 'Accions' }] : []),
  ];

  const llista = (productes ?? []).filter(p =>
    p.nom.toLowerCase().includes(query.toLowerCase())
  );

  const { sorted, sortKey, sortDir, handleSort } = useSortable(llista, columns);

  if (loading) return <div className={styles.status}>Carregant productes…</div>;
  if (error) return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const obrirCrear = () => { setApiError(null); setModal('crear'); };
  const obrirEditar = (p) => { setApiError(null); setModal(p); };
  const tancar = () => setModal(null);

  const handleSave = async (formData) => {
    try {
      if (modal === 'crear') await createProducte(formData);
      else await updateProducte(modal.id, formData);
      tancar();
      refetch();
    } catch (e) {
      setApiError(e.response?.data?.message ?? "Error en desar");
    }
  };

  const handleDeleteClick = (p) => {
    setDeleteError(null);
    setConfirmDelete({ id: p.id, nom: p.nom });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteProducte(confirmDelete.id);
      setConfirmDelete(null);
      refetch();
    } catch (e) {
      setDeleteError(e.response?.data?.message ?? "No s'ha pogut eliminar el producte");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Productes"
        subtitle={`${llista.length} producte${llista.length !== 1 ? 's' : ''} al catàleg`}
        action={canWrite && <Button onClick={obrirCrear}>+ Nou producte</Button>}
      />

      {apiError && <div className={styles.pageError}>{apiError}</div>}

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Cercar producte..."
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        emptyMessage={query ? 'Cap producte coincideix amb la cerca' : 'Cap producte registrat. Crea el primer!'}
        renderRow={(p) => {
          const sota = Number(p.estoc_actual) <= Number(p.estoc_minim);
          return (
            <tr key={p.id} className={sota ? styles.rowAlert : ''}>
              <td className={styles.nom}>{p.nom}</td>
              <td>
                {p.unitat_mesura.charAt(0).toUpperCase() + p.unitat_mesura.slice(1)}
                {unitats_mesura_especific.find(u => u.value === p.unitat_mesura)?.label ? ` (${unitats_mesura_especific.find(u => u.value === p.unitat_mesura).label})` : ''}
              </td>
              <td className={sota ? styles.alertText : ''}>{p.estoc_actual}</td>
              <td>{p.estoc_minim}</td>
              <td>
                <Badge variant={sota ? 'danger' : 'success'}>
                  {sota ? 'Sota mínims' : 'Correcte'}
                </Badge>
              </td>
              {canWrite && (
                <td className={styles.actions}>
                  <Button variant="secondary" size="sm" onClick={() => obrirEditar(p)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(p)}>
                    Eliminar
                  </Button>
                </td>
              )}
            </tr>
          );
        }}
      />

      {modal !== null && (
        <ProducteForm
          producte={modal === 'crear' ? null : modal}
          onSave={handleSave}
          onCancel={tancar}
        />
      )}

      {confirmDelete !== null && (
        <DeleteModal
          title="Eliminar producte"
          itemName={confirmDelete.nom}
          onClose={() => { setConfirmDelete(null); setDeleteError(null); }}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
          error={deleteError}
        />
      )}
    </div>
  );
}