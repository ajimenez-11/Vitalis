import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAlbarans, createAlbaran, deleteAlbaran,
         confirmarAlbaran, tornarEsborrany } from '../../api/albarans';
import { useAuth } from '../../context/AuthContext';
import AlbaranForm from './AlbaranForm';
import AlbaranDetall from './AlbaranDetall';
import styles from './Albarans.module.css';

export default function AlbaransPage() {
  const { data: albarans, loading, error, refetch } = useApi(getAlbarans);
  const { canWrite } = useAuth();
  const [vista,    setVista]    = useState(null); // null | 'crear' | {albaran}
  const [detall,   setDetall]   = useState(null); // albaran per veure detall/editar línies
  const [pageError, setPageError] = useState(null);

  const handleCreate = async (formData) => {
    const res = await createAlbaran(formData);
    setVista(null);
    refetch();
    // Obre directament el detall per afegir línies
    setDetall(res.data.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Segur que vols eliminar aquest albaran?')) return;
    setPageError(null);
    try {
      await deleteAlbaran(id);
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? 'No s\'ha pogut eliminar');
    }
  };

  const handleConfirmar = async (id) => {
    setPageError(null);
    try {
      await confirmarAlbaran(id);
      refetch();
      setDetall(null);
    } catch (e) {
      setPageError(e.response?.data?.message ?? 'Error en confirmar');
    }
  };

  const handleEsborrany = async (id) => {
    setPageError(null);
    try {
      await tornarEsborrany(id);
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? 'Error en revertir');
    }
  };

  if (loading) return <div className={styles.status}>Carregant albarans…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const llista = albarans ?? [];

  // Si hi ha un detall obert, mostra la vista de detall
  if (detall) {
    return (
      <AlbaranDetall
        albaran={detall}
        onBack={() => { setDetall(null); refetch(); }}
        onConfirmar={handleConfirmar}
        onEsborrany={handleEsborrany}
        canWrite={canWrite}
      />
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Albarans</h1>
          <p className={styles.subtitle}>{llista.length} albarans registrats</p>
        </div>
        {canWrite && (
          <button className={styles.btnPrimary} onClick={() => setVista('crear')}>
            + Nou albaran
          </button>
        )}
      </header>

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Proveïdor</th>
              <th>Data</th>
              <th>Registrat per</th>
              <th>Estat</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {llista.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Cap albaran registrat.
                </td>
              </tr>
            )}
            {llista.map((a) => (
              <tr key={a.id}>
                <td className={styles.idCol}>#{a.id}</td>
                <td className={styles.nom}>{a.proveidor?.nom ?? '—'}</td>
                <td>{new Date(a.data).toLocaleDateString('ca-ES')}</td>
                <td>{a.usuari?.nom ?? '—'}</td>
                <td>
                  <span className={`${styles.badge} ${styles[a.estat]}`}>
                    {a.estat}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.btnEdit}
                    onClick={() => setDetall(a)}
                  >
                    Veure
                  </button>
                  {canWrite && a.estat === 'esborrany' && (
                    <>
                      <button
                        className={styles.btnConfirm}
                        onClick={() => handleConfirmar(a.id)}
                      >
                        Confirmar
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleDelete(a.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  {canWrite && a.estat === 'confirmat' && (
                    <button
                      className={styles.btnWarning}
                      onClick={() => handleEsborrany(a.id)}
                    >
                      Revertir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vista === 'crear' && (
        <AlbaranForm
          onSave={handleCreate}
          onCancel={() => setVista(null)}
        />
      )}
    </div>
  );
}