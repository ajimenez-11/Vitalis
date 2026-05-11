import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAlbarans, createAlbaran, deleteAlbaran, confirmarAlbaran, tornarEsborrany } from '../../api/albarans';
import { useAuth } from '../../context/AuthContext';
import { useSortable } from '../../hooks/useSortable';
import { Badge, Button, PageHeader, Table } from '../../components/ui';
import AlbaranForm from './AlbaranForm';
import AlbaranDetall from './AlbaranDetall';
import styles from './Albarans.module.css';

export default function AlbaransPage() {
  const { data: albarans, loading, error, refetch } = useApi(getAlbarans);
  const { canWrite } = useAuth();
  const [modal, setModal] = useState(false);
  const [obert, setObert] = useState(null);
  const [pageError, setPageError] = useState(null);

  const columns = [
    { key: 'id',        label: '#',             sortable: true },
    { key: 'proveidor', label: 'Proveïdor',     sortable: true, sortValue: (a) => a.proveidor?.nom ?? '' },
    { key: 'data',      label: 'Data',          sortable: true, sortValue: (a) => new Date(a.data).getTime() },
    { key: 'usuari',    label: 'Registrat per', sortable: true, sortValue: (a) => a.usuari?.nom ?? '' },
    { key: 'estat',     label: 'Estat',         sortable: true },
    { key: 'accions',   label: 'Accions' },
  ];

  const llista = albarans ?? [];
  const { sorted, sortKey, sortDir, handleSort } = useSortable(llista, columns);

  if (loading) return <div className={styles.status}>Carregant albarans…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const crear = async (dades) => {
    const res = await createAlbaran(dades);
    setModal(false);
    refetch();
    setObert(res.data.data);
  };

  const eliminar = async (id) => {
    if (!window.confirm('Segur que vols eliminar aquest albaran?')) return;
    setPageError(null);
    try {
      await deleteAlbaran(id);
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? "No s'ha pogut eliminar");
    }
  };

  const confirmar = async (id) => {
    setPageError(null);
    try {
      await confirmarAlbaran(id);
      refetch();
      setObert(null);
    } catch (e) {
      setPageError(e.response?.data?.message ?? 'Error en confirmar');
    }
  };

  const revertir = async (id) => {
    setPageError(null);
    try {
      await tornarEsborrany(id);
      refetch();
    } catch (e) {
      setPageError(e.response?.data?.message ?? 'Error en revertir');
    }
  };

  if (obert) {
    return (
      <AlbaranDetall
        albaran={obert}
        onBack={() => { setObert(null); refetch(); }}
        onConfirmar={confirmar}
        onEsborrany={revertir}
        canWrite={canWrite}
      />
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Albarans"
        subtitle={`${llista.length} albarans registrats`}
        action={canWrite && <Button onClick={() => setModal(true)}>+ Nou albaran</Button>}
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
              <Badge variant={a.estat === 'confirmat' ? 'success' : 'warning'}>{a.estat}</Badge>
            </td>
            <td className={styles.actions}>
              <Button variant="secondary" size="sm" onClick={() => setObert(a)}>Veure</Button>
              {canWrite && a.estat === 'esborrany' && (
                <>
                  <Button size="sm" onClick={() => confirmar(a.id)}>Confirmar</Button>
                  <Button variant="danger" size="sm" onClick={() => eliminar(a.id)}>Eliminar</Button>
                </>
              )}
              {canWrite && a.estat === 'confirmat' && (
                <Button variant="warning" size="sm" onClick={() => revertir(a.id)}>Revertir</Button>
              )}
            </td>
          </tr>
        )}
      />

      {modal && <AlbaranForm onSave={crear} onCancel={() => setModal(false)} />}
    </div>
  );
}