import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getUsuaris, createUsuari, updateUsuari, deleteUsuari, toggleUsuari } from '../../api/usuaris';
import { useAuth } from '../../context/AuthContext';
import UsuariForm from './UsuariForm';
import styles from './Usuaris.module.css';

export default function Usuaris() {
  const { data: usuaris, loading, error, refetch } = useApi(getUsuaris);
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [usuariAEditar, setUsuariAEditar] = useState(null);

  if (loading) return <div className={styles.status}>Carregant usuaris...</div>;
  if (error) return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const handleCreate = () => {
    setUsuariAEditar(null);
    setModalOpen(true);
  };

  const handleEdit = (u) => {
    setUsuariAEditar(u);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (usuariAEditar) {
      await updateUsuari(usuariAEditar.id, formData);
    } else {
      await createUsuari(formData);
    }
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!confirm('Segur que vols eliminar aquest usuari?')) return;
    try {
      await deleteUsuari(id);
      refetch();
    } catch (e) {
      alert(e.response?.data?.message || 'Error en eliminar');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleUsuari(id);
      refetch();
    } catch (e) {
      alert(e.response?.data?.message || 'Error en canviar estat');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestió d'Usuaris</h1>
          <p className={styles.subtitle}>Administra els accessos del personal</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleCreate}>
          + Nou Usuari
        </button>
      </header>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estat</th>
              <th style={{ textAlign: 'right' }}>Accions</th>
            </tr>
          </thead>
          <tbody>
            {usuaris.map((u) => (
              <tr key={u.id} className={!u.actiu ? styles.inactiveRow : ''}>
                <td className={styles.userName}>{u.nom}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`${styles.badge} ${styles[u.rol]}`}>
                    {u.rol.replace('_', ' ')}
                  </span>
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
                  <button onClick={() => handleEdit(u)} className={styles.btnIcon}>✏️</button>
                  {u.id !== currentUser?.id && (
                    <button onClick={() => handleDelete(u.id)} className={styles.btnIcon}>🗑️</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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