import { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useApi } from '../../hooks/useApi';
import {
  getProveidors, createProveidor,
  updateProveidor, deleteProveidor,
} from '../../api/proveidors';
import { useAuth } from '../../context/AuthContext';
import { useSortable } from '../../hooks/useSortable'; 
import { Badge, Button, PageHeader, Table, Modal } from '../../components/ui';
import ProveidorForm from './ProveidorForm';
import styles from './Proveidors.module.css';

export default function ProveidorsPage() {
  const { data: proveidors, loading, error, refetch } = useApi(getProveidors);
  const { canWrite } = useAuth();
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [query, setQuery] = useState('');

  const columns = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'nif', label: 'NIF', sortable: true,
      sortValue: (p) => p.nif ?? '' },
    { key: 'telefon', label: 'Telèfon', sortable: true,
      sortValue: (p) => p.telefon ?? '' },
    { key: 'email', label: 'Email', sortable: true,
      sortValue: (p) => p.email ?? '' },
    { key: 'adreca', label: 'Adreça', sortable: true,
      sortValue: (p) => p.adreca ?? '' },
    ...(canWrite ? [{ key: 'accions', label: 'Accions' }] : []),
  ];

  const llista = (proveidors ?? []).filter(p =>
    p.nom.toLowerCase().includes(query.toLowerCase())
  );

  const { sorted, sortKey, sortDir, handleSort } = useSortable(llista, columns);

  if (loading) return <div className={styles.status}>Carregant proveïdors…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const obrirCrear  = ()  => { setPageError(null); setModal('crear'); };
  const obrirEditar = (p) => { setPageError(null); setModal(p); };
  const tancar = () => setModal(null);

  const handleSave = async (formData) => {
    try {
      if (modal === 'crear') await createProveidor(formData);
      else                   await updateProveidor(modal.id, formData);
      tancar();
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? "Error en desar");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Segur que vols eliminar aquest proveïdor?')) return;
    setDeleting(id);
    setPageError(null);
    try {
      await deleteProveidor(id);
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? "No s'ha pogut eliminar el proveïdor");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Proveïdors"
        subtitle={`${llista.length} proveïdor${llista.length !== 1 ? 's' : ''} al catàleg`}
        action={
          canWrite && (
            <Button onClick={obrirCrear}>+ Nou proveïdor</Button>
          )
        }
      />

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Cercar proveïdor..."
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={sorted} 
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        emptyMessage={query ? 'Cap proveïdor coincideix amb la cerca' : 'Cap proveïdor registrat. Crea el primer!'}
        renderRow={(p) => (
          <tr key={p.id}>
            <td className={styles.nom}>{p.nom}</td>
            <td>{p.nif ?? '—'}</td>
            <td>{p.telefon ?? '—'}</td>
            <td>{p.email ?? '—'}</td>
            <td>{p.adreca ?? '—'}</td>
            {canWrite && (
              <td className={styles.actions}>
                <Button variant="secondary" size="sm" onClick={() => obrirEditar(p)}>
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                >
                  {deleting === p.id ? '…' : 'Eliminar'}
                </Button>
              </td>
            )}
          </tr>
        )}
      />

      {modal !== null && (
        <ProveidorForm
          proveidor={modal === 'crear' ? null : modal}
          onSave={handleSave}
          onCancel={tancar}
        />
      )}
    </div>
  );
}