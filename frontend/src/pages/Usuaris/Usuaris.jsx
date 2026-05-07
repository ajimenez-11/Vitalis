import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getUsuaris, createUsuari, updateUsuari, deleteUsuari, toggleUsuari } from '../../api/usuaris';
import { useAuth } from '../../context/AuthContext';
import { useSortable } from '../../hooks/useSortable'; // 1. Importación añadida
import { Badge, Button, PageHeader, Table } from '../../components/ui';
import UsuariForm from './UsuariForm';
import styles from './Usuaris.module.css';

export default function Usuaris() {
  const { data: usuaris, loading, error, refetch } = useApi(getUsuaris);
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [usuariAEditar, setUsuariAEditar] = useState(null);

  // 2. Definición de columnas con sortValue
  const columns = [
    { key: 'nom',   label: 'Nom',   sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'rol',   label: 'Rol',   sortable: true },
    { key: 'estat', label: 'Estat', sortable: true, 
      sortValue: (u) => u.actiu ? 1 : 0 },
    { key: 'accions', label: 'Accions' },
  ];

  // 3. Preparar la lista y aplicar ordenación
  const llista = usuaris ?? [];
  const { sorted, sortKey, sortDir, handleSort } = useSortable(llista, columns);

  // 4. Early returns DESPUÉS de los hooks
  if (loading) return <div className={styles.status}>Carregant usuaris...</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const handleCreate = () => { setUsuariAEditar(null); setModalOpen(true); };
  const handleEdit   = (u) => { setUsuariAEditar(u); setModalOpen(true); };

  const handleSave = async (formData) => {
    if (usuariAEditar) await updateUsuari(usuariAEditar.id, formData);
    else               await createUsuari(formData);
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!confirm('Segur que vols eliminar aquest usuari?')) return;
    try { await deleteUsuari(id); refetch(); }
    catch (e) { alert(e.response?.data?.message || 'Error en eliminar'); }
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
        data={sorted} // 5. Usamos la lista ordenada
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        emptyMessage="Cap usuari registrat."
        renderRow={(u) => (
          <tr key={u.id} className={!u.actiu ? styles.inactiveRow : ''}>
            <td className={styles.userName}>{u.nom}</td>
            <td>{u.email}</td>
            <td>
              <Badge variant={u.rol}>
                {u.rol.replace('_', ' ')}
              </Badge>
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
                <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>🗑️</Button>
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
    </div>
  );
}