import { useState, useEffect } from 'react';
import { MdEdit, MdSearch, MdRestaurant, MdClose } from 'react-icons/md';
import styles from './Receptes.module.css';
import { getReceptes, registrarConsum } from '../../api/receptes';
import { useAuth } from '../../context/AuthContext';
import ReceptaDetall from './ReceptaDetall';
import ReceptaForm from './ReceptaForm';

const getImatgeUrl = (recepta) => {
  if (recepta.imatge_url) return recepta.imatge_url;
  if (recepta.imatge) return `http://localhost:8000/${recepta.imatge}`;
  return null;
};

// ── Modal Registrar Consum ──────────────────────────────────────────
const ConsumModal = ({ recepta, onClose, onSuccess }) => {
  const [porcions, setPorcions]     = useState(1);
  const [observacions, setObs]      = useState('');
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);
  const [mancances, setMancances]   = useState([]);

  const handleSubmit = async () => {
    if (!porcions || porcions < 1) {
      setError('El nombre de porcions ha de ser mínim 1');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await registrarConsum(recepta.id, { porcions: parseInt(porcions), observacions: observacions || undefined });
      onSuccess?.();
      onClose();
    } catch (e) {
      const data = e?.response?.data;
      if (data?.mancances) {
        setMancances(data.mancances);
        setError(data.message || 'Estoc insuficient');
      } else {
        setError(data?.message || 'Error en registrar el consum');
      }
    } finally {
      setSaving(false);
    }
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
          <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><MdClose size={20} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>
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
            <input type="number" min="1" value={porcions} onChange={(e) => setPorcions(e.target.value)} className={styles.input} />
          </div>
          <div className={styles.modalActions}>
            <button className={styles.btnCancelSm} onClick={onClose}>Cancel·lar</button>
            <button className={styles.btnPrimary} onClick={handleSubmit} disabled={saving}>{saving ? '...' : 'Registrar'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ReceptaCard ────────────────────────────────────────────────────
const ReceptaCard = ({ recepta, onVeure, onEditar, onConsum, canWrite }) => {
  const nombreMostrar = recepta.nom || recepta.nombre_receta || 'Sense nom';
  const imatgeUrl = getImatgeUrl(recepta);

  return (
    <div className={styles.cardList}>
      {imatgeUrl ? <img src={imatgeUrl} className={styles.cardImg} alt={nombreMostrar} /> : <div className={styles.cardImgPlaceholder}>🍽️</div>}
      <div className={styles.cardBody}>
        <h5 className={styles.cardTitleMain}>{nombreMostrar}</h5>
        <div className={styles.cardActionsGrid}>
          <button onClick={() => onVeure(recepta)} className={styles.buttonLists}>Ingredients <MdEdit /></button>
          {canWrite && <button onClick={() => onEditar(recepta)} className={styles.buttonEditAlt}>Editar</button>}
          {canWrite && <button onClick={() => onConsum(recepta)} className={styles.buttonConsumAlt}>Consum <MdRestaurant /></button>}
        </div>
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
  const { canWrite } = useAuth();

  const fetchReceptes = async () => {
    try {
      setLoading(true);
      const res = await getReceptes();
      setReceptes(res.data?.data || res.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchReceptes(); }, []);

  const filtered = receptes.filter(r => (r.nom || r.nombre_receta || '').toLowerCase().includes(query.toLowerCase()));

  // Aplicamos el contenedor de ancho fijo (640px) a las vistas de detalle y formulario
  if (detall) return (
    <div className={styles.pageCenter}>
      <div className={styles.formContainer}>
        <ReceptaDetall recepta={detall} onBack={() => setDetall(null)} canWrite={canWrite} />
      </div>
    </div>
  );

  if (editant) return (
    <div className={styles.pageCenter}>
      <div className={styles.formContainer}>
        <ReceptaForm id={editant === 'crear' ? null : editant} onBack={() => {setEditant(null); fetchReceptes();}} />
      </div>
    </div>
  );

  return (
    <div className={styles.pageCenter}>
      <header className={styles.header}>
        <div><h1 className={styles.title}>Receptes</h1><p className={styles.subtitle}>{filtered.length} receptes</p></div>
        <div className={styles.headerRight}>
          <div className={styles.searchWrapper}>
            <MdSearch className={styles.searchIcon} /><input type="text" value={query} onChange={e => setQuery(e.target.value)} className={styles.inputSearch} placeholder="Cerca..." />
          </div>
          {canWrite && <button className={styles.btnPrimary} onClick={() => setEditant('crear')}>+ Nova recepta</button>}
        </div>
      </header>
      <div className={styles.receptaGrid}>
        {loading ? <div className={styles.emptyFull}>Carregant...</div> : 
          filtered.map(r => <ReceptaCard key={r.id} recepta={r} canWrite={canWrite} onVeure={setDetall} onEditar={rec => setEditant(rec.id)} onConsum={setConsum} />)
        }
      </div>
      {consum && <ConsumModal recepta={consum} onClose={() => setConsum(null)} onSuccess={fetchReceptes} />}
    </div>
  );
};

export default Receptes;