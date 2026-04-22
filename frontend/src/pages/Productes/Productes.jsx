import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import {
  getProductes,
  createProducte,
  updateProducte,
  deleteProducte,
} from '../../api/productes';
import ProducteForm from './ProducteForm';
import styles from './Productes.module.css';

export default function ProductesPage() {
  const { data: productes, loading, error, refetch } = useApi(getProductes);
  const [modal,    setModal]   = useState(null); // null | 'crear' | {producte}
  const [deleting, setDeleting] = useState(null);
  const [apiError, setApiError] = useState(null);

  const obrirCrear  = ()  => { setApiError(null); setModal('crear'); };
  const obrirEditar = (p) => { setApiError(null); setModal(p); };
  const tancar      = ()  => setModal(null);

  const handleSave = async (formData) => {
    if (modal === 'crear') {
      await createProducte(formData);
    } else {
      await updateProducte(modal.id, formData);
    }
    tancar();
    refetch();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Segur que vols eliminar aquest producte?')) return;
    setDeleting(id);
    setApiError(null);
    try {
      await deleteProducte(id);
      refetch();
    } catch (e) {
      // 409 = té moviments associats
      setApiError(
        e.response?.data?.message ?? 'No s\'ha pogut eliminar el producte'
      );
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className={styles.status}>Carregant productes…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const llista = productes ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Productes</h1>
          <p className={styles.subtitle}>{llista.length} productes al catàleg</p>
        </div>
        <button className={styles.btnPrimary} onClick={obrirCrear}>
          + Nou producte
        </button>
      </header>

      {apiError && (
        <div className={styles.pageError}>{apiError}</div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Unitat</th>
              <th>Estoc actual</th>
              <th>Estoc mínim</th>
              <th>Estat</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {llista.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Cap producte registrat. Crea el primer!
                </td>
              </tr>
            )}
            {llista.map((p) => {
              const sota = Number(p.estoc_actual) <= Number(p.estoc_minim);
              return (
                <tr key={p.id} className={sota ? styles.rowAlert : ''}>
                  <td className={styles.nom}>{p.nom}</td>
                  <td>{p.unitat_mesura}</td>
                  <td className={sota ? styles.alertText : ''}>
                    {p.estoc_actual}
                  </td>
                  <td>{p.estoc_minim}</td>
                  <td>
                    {sota
                      ? <span className={styles.badgeAlert}>Sota mínims</span>
                      : <span className={styles.badgeOk}>Correcte</span>
                    }
                  </td>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <ProducteForm
          producte={modal === 'crear' ? null : modal}
          onSave={handleSave}
          onCancel={tancar}
        />
      )}
    </div>
  );
}