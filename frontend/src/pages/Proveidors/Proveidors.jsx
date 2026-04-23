import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import {
  getProveidors, createProveidor,
  updateProveidor, deleteProveidor,
} from '../../api/proveidors';
import { useAuth } from '../../context/AuthContext';
import ProveidorForm from './ProveidorForm';
import styles from './Proveidors.module.css';

export default function ProveidorsPage() {
  const { data: proveidors, loading, error, refetch } = useApi(getProveidors);
  const { canWrite } = useAuth();
  const [modal,    setModal]    = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [pageError, setPageError] = useState(null);

  const obrirCrear  = ()  => { setPageError(null); setModal('crear'); };
  const obrirEditar = (p) => { setPageError(null); setModal(p); };
  const tancar      = ()  => setModal(null);

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
      setPageError(e.response?.data?.message ?? 'No s\'ha pogut eliminar el proveïdor');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className={styles.status}>Carregant proveïdors…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const llista = proveidors ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Proveïdors</h1>
          <p className={styles.subtitle}>{llista.length} proveïdors al catàleg</p>
        </div>
        {canWrite && (
          <button className={styles.btnPrimary} onClick={obrirCrear}>
            + Nou proveïdor
          </button>
        )}
      </header>

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>NIF</th>
              <th>Telèfon</th>
              <th>Email</th>
              <th>Adreça</th>
              {canWrite && <th>Accions</th>}
            </tr>
          </thead>
          <tbody>
            {llista.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Cap proveïdor registrat. Crea el primer!
                </td>
              </tr>
            )}
            {llista.map((p) => (
              <tr key={p.id}>
                <td className={styles.nom}>{p.nom}</td>
                <td>{p.nif ?? '—'}</td>
                <td>{p.telefon ?? '—'}</td>
                <td>{p.email ?? '—'}</td>
                <td>{p.adreca ?? '—'}</td>
                {canWrite && (
                  <td className={styles.actions}>
                    <button
                      className={styles.btnEdit}
                      onClick={() => obrirEditar(p)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                    >
                      {deleting === p.id ? '…' : 'Eliminar'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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