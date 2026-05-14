import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getUsuaris, createUsuari, updateUsuari, deleteUsuari, toggleUsuari } from '../../api/usuaris';
import { useAuth } from '../../context/AuthContext';
import { useSortable } from '../../hooks/useSortable';
import { Badge, Button, PageHeader, Table } from '../../components/ui';
import UsuariForm from './UsuariForm';
import styles from './Usuaris.module.css';

const EliminarModal = ({ nom, onClose, onConfirm, deleting, error }) => (
  <div className={styles.overlay}>
    <div className={styles.modalConsum}>
      <div className={styles.modalBody}>
        {error && <div className={styles.formError}>{error}</div>}
        <p className={styles.deleteWarning}>
          Estàs a punt d'eliminar l'usuari <strong>{nom}</strong>. Aquesta acció no es pot desfer.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.btnCancelSm} onClick={onClose} disabled={deleting}>
            Cancel·lar
          </button>
          <button className={styles.btnDanger} onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Eliminant...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function Usuaris() {
  const { data: usuaris, loading, error, refetch } = useApi(getUsuaris);
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [usuariAEditar, setUsuariAEditar] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const columns = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'rol', label: 'Rol', sortable: true },
    { key: 'estat', label: 'Estat', sortable: true, sortValue: (u) => u.actiu ? 1 : 0 },
    { key: 'accions', label: 'Accions' },
  ];

  const llista = usuaris ?? [];
  const { sorted, sortKey, sortDir, handleSort } = useSortable(llista, columns);

  if (loading) return <div className={styles.status}>Carregant usuaris...</div>;
  if (error) return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const handleCreate = () => { setUsuariAEditar(null); setModalOpen(true); };
  const handleEdit = (u) => { setUsuariAEditar(u); setModalOpen(true); };

  const handleSave = async (formData) => {
    if (usuariAEditar) await updateUsuari(usuariAEditar.id, formData);
    else await createUsuari(formData);
    setModalOpen(false);
    refetch();
  };

  const handleDeleteClick = (u) => {
    setDeleteError(null);
    setConfirmDelete({ id: u.id, nom: u.nom });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteUsuari(confirmDelete.id);
      setConfirmDelete(null);
      refetch();
    } catch (e) {
      setDeleteError(e.response?.data?.message || 'Error en eliminar');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (id) => {
    try { await toggleUsuari(id); refetch(); }
    catch (e) { alert(e.response?.data?.message || 'Error en canviar estat'); }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Gestió d'Usuaris"
        subtitle="Administra els accessos del personal"
        action={<Button onClick={handleCreate}>+ Nou Usuari</Button>}
      />

      <Table
        columns={columns}
        data={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        emptyMessage="Cap usuari registrat."
        renderRow={(u) => (
          <tr key={u.id} className={!u.actiu ? styles.inactiveRow : ''}>
            <td className={styles.userName}>{u.nom}</td>
            <td>{u.email}</td>
            <td>
              <Badge variant={u.rol}>{u.rol.replace('_', ' ')}</Badge>
            </td>
            <td>
              <button
                className={u.actiu ? styles.btnActive : styles.btnInactive}
                onClick={() => handleToggle(u.id)}
                disabled={u.id === currentUser?.id}
              >
                {u.actiu ? 'Actiu' : 'Inactiu'}
              </button>
            </td>
            <td className={styles.actions}>
              <Button size="sm" variant="secondary" onClick={() => handleEdit(u)}>✏️ Editar</Button>
              {u.id !== currentUser?.id && (
                <Button size="sm" variant="danger" onClick={() => handleDeleteClick(u)}>🗑️</Button>
              )}
            </td>
          </tr>
        )}
      />

      {modalOpen && (
        <UsuariForm
          usuari={usuariAEditar}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      )}

      {confirmDelete && (
        <EliminarModal
          nom={confirmDelete.nom}
          onClose={() => { setConfirmDelete(null); setDeleteError(null); }}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
          error={deleteError}
        />
      )}
    </div>
  );
}