import { useState, useEffect } from 'react';
import { MdEdit, MdSearch, MdRestaurant, MdClose, MdMenuBook, MdDelete, MdCheckCircle } from 'react-icons/md';
import styles from './Receptes.module.css';
import { getReceptes, registrarConsum, deleteRecepta } from '../../api/receptes';
import { useAuth } from '../../context/AuthContext';
import { Button, PageHeader } from '../../components/ui';
import ReceptaDetall from './ReceptaDetall';
import ReceptaForm from './ReceptaForm';

const getImatgeUrl = (recepta) => {
  if (recepta.imatge_url) return recepta.imatge_url;
  if (recepta.imatge) return `http://localhost:8000/${recepta.imatge}`;
  return null;
};

// Modal Registrar Consum 
const ConsumModal = ({ recepta, onClose, onSuccess }) => {
  const [porcions, setPorcions] = useState(1);
  const [observacions, setObs] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [mancances, setMancances] = useState([]);

  const handleSubmit = async () => {
    if (!porcions || porcions < 1) { setError('El nombre de porcions ha de ser mínim 1'); return; }
    setSaving(true);
    setError(null);
    try {
      await registrarConsum(recepta.id, { porcions: parseInt(porcions), observacions: observacions || undefined });
      onSuccess?.();
      onClose();
    } catch (e) {
      const data = e?.response?.data;
      if (data?.mancances) { setMancances(data.mancances); setError(data.message || 'Estoc insuficient'); }
      else setError(data?.message || 'Error en registrar el consum');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalConsum}>
        <div className={styles.modalHeader}>
          <div className={styles.iconCircle}><MdRestaurant size={18} color="#0F6E56" /></div>
          <div style={{ flex: 1 }}>
            <p className={styles.modalTitleInline}>Registrar consum</p>
            <p className={styles.modalSubtitleInline}>{recepta.nom}</p>
          </div>
          <button onClick={onClose} className={styles.btnClose}><MdClose size={20} /></button>
        </div>
        <div className={styles.modalBody}>
          {error && <div className={styles.formError}>{error}</div>}
          {mancances.length > 0 && (
            <div className={styles.mancancesBox}>
              {mancances.map((m, i) => (
                <div key={i}><strong>{m.producte}</strong>: calen {m.quantitat_necessaria}, hi ha {m.estoc_actual}</div>
              ))}
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Nombre de porcions *</label>
            <input
              type="number" min="1" value={porcions}
              onChange={e => setPorcions(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.modalActions}>
            <button className={styles.btnCancelSm} onClick={onClose}>Cancel·lar</button>
            <button className={styles.btnPrimaryModal} onClick={handleSubmit} disabled={saving}>
              {saving ? '...' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EliminarSeleccioModal = ({ count, onClose, onConfirm, deleting }) => (
  <div className={styles.overlay}>
    <div className={styles.modalConsum}>
      <div className={styles.modalHeader}>
        <div className={`${styles.iconCircle} ${styles.iconCircleDanger}`}>
          <MdDelete size={18} color="#dc2626" />
        </div>
        <div style={{ flex: 1 }}>
          <p className={styles.modalTitleInline}>Eliminar receptes</p>
          <p className={styles.modalSubtitleInline}>{count} recepta{count !== 1 ? 's' : ''} seleccionada{count !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={onClose} className={styles.btnClose}><MdClose size={20} /></button>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.deleteWarning}>
          Estàs a punt d'eliminar <strong>{count} recepta{count !== 1 ? 's' : ''}</strong>. Aquesta acció no es pot desfer.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.btnCancelSm} onClick={onClose} disabled={deleting}>Cancel·lar</button>
          <button className={styles.btnDanger} onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Eliminant...' : `Eliminar ${count}`}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ReceptaCard
const ReceptaCard = ({ recepta, onVeure, onEditar, onConsum, canWrite, seleccionada, onToggleSelect }) => {
  const nom = recepta.nom || recepta.nombre_receta || 'Sense nom';
  const imatgeUrl = getImatgeUrl(recepta);

  return (
    <div
      className={`${styles.card} ${seleccionada ? styles.cardSelected : ''}`}
      onClick={() => onToggleSelect(recepta.id)}
    >
      {/* Check de selecció */}
      <div className={`${styles.selectBadge} ${seleccionada ? styles.selectBadgeActive : ''}`}>
        <MdCheckCircle size={20} />
      </div>

      {imatgeUrl
        ? <img src={imatgeUrl} className={styles.cardImg} alt={nom} />
        : (
          <div className={styles.cardImgPlaceholder}>
            <MdMenuBook className={styles.placeholderIcon} />
          </div>
        )
      }
      <div className={styles.cardBody}>
        <h5 className={styles.cardTitle}>{nom}</h5>
        {recepta.descripcio && (
          <p className={styles.cardDesc}>{recepta.descripcio}</p>
        )}
        {recepta.porcions_base && (
          <span className={styles.metaPill}>{recepta.porcions_base} porcions</span>
        )}
      </div>
      <div className={styles.cardFooter}>
        <button onClick={e => { e.stopPropagation(); onVeure(recepta); }} className={styles.actionBtn}>
          <MdEdit size={14} /> Ingredients
        </button>
        {canWrite && (
          <button onClick={e => { e.stopPropagation(); onEditar(recepta); }} className={`${styles.actionBtn} ${styles.actionBtnEdit}`}>
            Editar
          </button>
        )}
        {canWrite && (
          <button onClick={e => { e.stopPropagation(); onConsum(recepta); }} className={`${styles.actionBtn} ${styles.actionBtnConsum}`}>
            <MdRestaurant size={14} /> Consum
          </button>
        )}
      </div>
    </div>
  );
};

const Receptes = () => {
  const [receptes, setReceptes] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detall, setDetall] = useState(null);
  const [editant, setEditant] = useState(null);
  const [consum, setConsum] = useState(null);
  const [seleccionades, setSeleccionades] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { canWrite } = useAuth();

  const fetchReceptes = async () => {
    try {
      setLoading(true);
      const res = await getReceptes();
      setReceptes(res.data?.data || res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReceptes(); }, []);

  const toggleSelect = (id) => {
    if (!canWrite) return;
    setSeleccionades(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleEliminarSeleccionades = async () => {
    setDeleting(true);
    try {
      await Promise.all([...seleccionades].map(id => deleteRecepta(id)));
      setSeleccionades(new Set());
      setConfirmDelete(false);
      fetchReceptes();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = receptes.filter(r =>
    (r.nom || r.nombre_receta || '').toLowerCase().includes(query.toLowerCase())
  );

  if (detall) return (
    <div className={styles.page}>
      <ReceptaDetall recepta={detall} onBack={() => setDetall(null)} canWrite={canWrite} />
    </div>
  );

  if (editant !== null) return (
    <div className={styles.page}>
      <ReceptaForm
        id={editant === 'crear' ? 'crear' : editant}
        onBack={() => { setEditant(null); fetchReceptes(); }}
      />
    </div>
  );

  return (
    <div className={styles.page}>
      <PageHeader
        title="Receptes"
        subtitle={`${filtered.length} recepta${filtered.length !== 1 ? 's' : ''} al catàleg`}
        action={
          canWrite && (
            <Button onClick={() => setEditant('crear')}>+ Nova recepta</Button>
          )
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Cercar recepta..."
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.status}>Carregant receptes…</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <MdMenuBook className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>
            {query ? 'Cap recepta coincideix amb la cerca' : 'Encara no hi ha receptes'}
          </p>
          {!query && canWrite && (
            <Button onClick={() => setEditant('crear')}>Crea la primera recepta</Button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(r => (
            <ReceptaCard
              key={r.id}
              recepta={r}
              canWrite={canWrite}
              seleccionada={seleccionades.has(r.id)}
              onToggleSelect={toggleSelect}
              onVeure={setDetall}
              onEditar={rec => setEditant(rec.id)}
              onConsum={setConsum}
            />
          ))}
        </div>
      )}

      {seleccionades.size > 0 && (
        <div className={styles.selectionBar}>
          <span className={styles.selectionCount}>
            <MdCheckCircle size={18} />
            {seleccionades.size} recepta{seleccionades.size !== 1 ? 's' : ''} seleccionada{seleccionades.size !== 1 ? 's' : ''}
          </span>
          <div className={styles.selectionActions}>
            <button
              className={styles.btnCancelSm}
              onClick={() => setSeleccionades(new Set())}
            >
              Cancel·lar
            </button>
            <button
              className={styles.btnDanger}
              onClick={() => setConfirmDelete(true)}
            >
              <MdDelete size={16} />
              Eliminar {seleccionades.size}
            </button>
          </div>
        </div>
      )}

      {consum && (
        <ConsumModal
          recepta={consum}
          onClose={() => setConsum(null)}
          onSuccess={fetchReceptes}
        />
      )}

      {confirmDelete && (
        <EliminarSeleccioModal
          count={seleccionades.size}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleEliminarSeleccionades}
          deleting={deleting}
        />
      )}
    </div>
  );
};

export default Receptes;