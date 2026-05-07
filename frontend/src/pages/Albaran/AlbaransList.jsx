import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAlbarans, createAlbaran, deleteAlbaran,
         confirmarAlbaran, tornarEsborrany } from '../../api/albarans';
import { useAuth } from '../../context/AuthContext';
import { useSortable } from '../../hooks/useSortable';
import { Badge, Button, PageHeader, Table } from '../../components/ui';
import AlbaranForm from './AlbaranForm';
import AlbaranDetall from './AlbaranDetall';
import styles from './Albarans.module.css';

export default function AlbaransPage() {
  const { data: albarans, loading, error, refetch } = useApi(getAlbarans);
  const { canWrite } = useAuth();
  const [vista, setVista] = useState(null);
  const [detall, setDetall] = useState(null);
  const [pageError, setPageError] = useState(null);

  const columns = [
    { key: 'id',        label: '#',             sortable: true },
    { key: 'proveidor', label: 'Proveïdor',     sortable: true,
      sortValue: (a) => a.proveidor?.nom ?? '' },
    { key: 'data',      label: 'Data',          sortable: true,
      sortValue: (a) => new Date(a.data).getTime() },
    { key: 'usuari',    label: 'Registrat per', sortable: true,
      sortValue: (a) => a.usuari?.nom ?? '' },
    { key: 'estat',     label: 'Estat',         sortable: true },
    { key: 'accions',   label: 'Accions' },
  ];

  const llista = albarans ?? [];
  const { sorted, sortKey, sortDir, handleSort } = useSortable(llista, columns);

  // Early returns DESPUÉS de todos los hooks
  if (loading) return <div className={styles.status}>Carregant albarans…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const handleCreate = async (formData) => {
    const res = await createAlbaran(formData);
    setVista(null);
    refetch();
    setDetall(res.data.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Segur que vols eliminar aquest albaran?')) return;
    setPageError(null);
    try {
      await deleteAlbaran(id);
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? "No s'ha pogut eliminar");
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
      <PageHeader
        title="Albarans"
        subtitle={`${llista.length} albarans registrats`}
        action={
          canWrite && (
            <Button onClick={() => setVista('crear')}>+ Nou albaran</Button>
          )
        }
      />

      {pageError && <div className={styles.pageError}>{pageError}</div>}

      <Table
        columns={columns}
        data={sorted}
        emptyMessage="Cap albaran registrat."
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        renderRow={(a) => (
          <tr key={a.id}>
            <td className={styles.idCol}>#{a.id}</td>
            <td className={styles.nom}>{a.proveidor?.nom ?? '—'}</td>
            <td>{new Date(a.data).toLocaleDateString('ca-ES')}</td>
            <td>{a.usuari?.nom ?? '—'}</td>
            <td>
              <Badge variant={a.estat === 'confirmat' ? 'success' : 'warning'}>
                {a.estat}
              </Badge>
            </td>
            <td className={styles.actions}>
              <Button variant="secondary" size="sm" onClick={() => setDetall(a)}>
                Veure
              </Button>
              {canWrite && a.estat === 'esborrany' && (
                <>
                  <Button size="sm" onClick={() => handleConfirmar(a.id)}>
                    Confirmar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>
                    Eliminar
                  </Button>
                </>
              )}
              {canWrite && a.estat === 'confirmat' && (
                <Button variant="warning" size="sm" onClick={() => handleEsborrany(a.id)}>
                  Revertir
                </Button>
              )}
            </td>
          </tr>
        )}
      />

      {vista === 'crear' && (
        <AlbaranForm
          onSave={handleCreate}
          onCancel={() => setVista(null)}
        />
      )}
    </div>
  );
}