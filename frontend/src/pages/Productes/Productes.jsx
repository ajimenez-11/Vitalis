import { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useApi } from '../../hooks/useApi';
import {
  getProductes, createProducte, updateProducte, deleteProducte,
} from '../../api/productes';
import { Badge, Button, PageHeader, Table } from '../../components/ui';
import ProducteForm from './ProducteForm';
import styles from './Productes.module.css';

export default function ProductesPage() {
  const { data: productes, loading, error, refetch } = useApi(getProductes);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [query, setQuery] = useState('');

  const obrirCrear = () => { setApiError(null); setModal('crear'); };
  const obrirEditar = (p) => { setApiError(null); setModal(p); };
  const tancar = () => setModal(null);

  const handleSave = async (formData) => {
    if (modal === 'crear') await createProducte(formData);
    else                   await updateProducte(modal.id, formData);
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
      setApiError(e.response?.data?.message ?? "No s'ha pogut eliminar el producte");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className={styles.status}>Carregant productes…</div>;
  if (error)   return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const llista = (productes ?? []).filter(p =>
    p.nom.toLowerCase().includes(query.toLowerCase())
  );

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'unitat', label: 'Unitat' },
    { key: 'estoc_actual', label: 'Estoc actual' },
    { key: 'estoc_minim', label: 'Estoc mínim' },
    { key: 'estat', label: 'Estat' },
    { key: 'accions', label: 'Accions' },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Productes"
        subtitle={`${llista.length} producte${llista.length !== 1 ? 's' : ''} al catàleg`}
        action={<Button onClick={obrirCrear}>+ Nou producte</Button>}
      />

      {apiError && <div className={styles.pageError}>{apiError}</div>}

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Cercar producte..."
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={llista}
        emptyMessage={query ? 'Cap producte coincideix amb la cerca' : 'Cap producte registrat. Crea el primer!'}
        renderRow={(p) => {
          const sota = Number(p.estoc_actual) <= Number(p.estoc_minim);
          return (
            <tr key={p.id} className={sota ? styles.rowAlert : ''}>
              <td className={styles.nom}>{p.nom}</td>
              <td>{p.unitat_mesura}</td>
              <td className={sota ? styles.alertText : ''}>{p.estoc_actual}</td>
              <td>{p.estoc_minim}</td>
              <td>
                <Badge variant={sota ? 'danger' : 'success'}>
                  {sota ? 'Sota mínims' : 'Correcte'}
                </Badge>
              </td>
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
            </tr>
          );
        }}
      />

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