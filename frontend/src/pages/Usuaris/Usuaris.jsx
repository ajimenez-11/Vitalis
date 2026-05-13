import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getUsuaris, createUsuari, updateUsuari, deleteUsuari, toggleUsuari } from '../../api/usuaris';
import { useAuth } from '../../context/AuthContext';
import { useSortable } from '../../hooks/useSortable'; 
import { Badge, Button, PageHeader, Table } from '../../components/ui';
import UsuariForm from './UsuariForm';
import styles from './Usuaris.module.css';

export default function Usuaris() {
  const { data: usuaris, loading, error, refetch } = useApi(getUsuaris);
  const { user: usuariActual } = useAuth();
  const [modal, setModal] = useState(false);
  const [editant, setEditant] = useState(null);

  const columns = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'rol', label: 'Rol', sortable: true },
    { key: 'estat', label: 'Estat', sortable: true, 
      sortValue: (u) => u.actiu ? 1 : 0 },
    { key: 'accions', label: 'Accions' },
  ];

  const llista = usuaris ?? [];
  const { sorted, sortKey, sortDir, handleSort } = useSortable(llista, columns);

  if (loading) return <div className={styles.status}>Carregant usuaris...</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const desar = async (dades) => {
    if (editant) await updateUsuari(editant.id, dades);
    else         await createUsuari(dades);
    setModal(false);
    refetch();
  };

  const eliminar = async (id) => {
    if (!confirm('Segur que vols eliminar aquest usuari?')) return;
    try { await deleteUsuari(id); refetch(); }
    catch (e) { alert(e.response?.data?.message || 'Error en eliminar'); }
  };

  const canviarEstat = async (id) => {
    try { await toggleUsuari(id); refetch(); }
    catch (e) { alert(e.response?.data?.message || 'Error en canviar estat'); }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Gestió d'Usuaris"
        subtitle="Administra els accessos del personal"
        action={<Button onClick={() => { setEditant(null); setModal(true); }}>+ Nou Usuari</Button>}
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
              <button className={u.actiu ? styles.btnActive : styles.btnInactive} onClick={() => canviarEstat(u.id)} disabled={u.id === usuariActual?.id}>
                {u.actiu ? 'Actiu' : 'Inactiu'}
              </button>
            </td>
            <td className={styles.actions}>
              <Button size="sm" variant="secondary" onClick={() => { setEditant(u); setModal(true); }}>✏️ Editar</Button>
              {u.id !== usuariActual?.id && (
                <Button size="sm" variant="danger" onClick={() => eliminar(u.id)}>🗑️</Button>
              )}
            </td>
          </tr>
        )}
      />
      {modal && <UsuariForm usuari={editant} onSave={desar} onCancel={() => setModal(false)} />}
    </div>
  );
}