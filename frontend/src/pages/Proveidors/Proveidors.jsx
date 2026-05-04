import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import {
  getProveidors, createProveidor,
  updateProveidor, deleteProveidor,
} from '../../api/proveidors';
import { useAuth } from '../../context/AuthContext';
import { Badge, Button, PageHeader, Table, Modal } from '../../components/ui';
import { FormField } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';
import ProveidorForm from './ProveidorForm';
import styles from './Proveidors.module.css';

export default function ProveidorsPage() {
  const { data: proveidors, loading, error, refetch } = useApi(getProveidors);
  const { canWrite } = useAuth();
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [pageError, setPageError] = useState(null);

  const obrirCrear  = ()  => { setPageError(null); setModal('crear'); };
  const obrirEditar = (p) => { setPageError(null); setModal(p); };
  const tancar = () => setModal(null);

  const handleSave = async (formData) => {
    if (modal === 'crear') await createProveidor(formData);
    else                   await updateProveidor(modal.id, formData);
    tancar();
    refetch();
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

  if (loading) return <div className={styles.status}>Carregant proveïdors…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const llista = proveidors ?? [];

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'nif', label: 'NIF' },
    { key: 'telefon', label: 'Telèfon' },
    { key: 'email', label: 'Email' },
    { key: 'adreca', label: 'Adreça' },
    ...(canWrite ? [{ key: 'accions', label: 'Accions' }] : []),
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Proveïdors"
        subtitle={`${llista.length} proveïdors al catàleg`}
        action={
          canWrite && (
            <Button onClick={obrirCrear}>+ Nou proveïdor</Button>
          )
        }
      />

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      <Table
        columns={columns}
        data={llista}
        emptyMessage="Cap proveïdor registrat. Crea el primer!"
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