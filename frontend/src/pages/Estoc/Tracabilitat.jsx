import { useState, useEffect } from 'react';
// Corregit: Useem tracabilitatList en comptes de tracabilitatTots
import { tracabilitatLot, tracabilitatProducte, tracabilitatList } from '../../api/tracabilitat';
import styles from './Tracabilitat.module.css';

// ── Badge de tipus de moviment ──────────────────────────────────────────────
const TipusBadge = ({ tipus }) => {
  const colors = {
    entrada: { bg: '#d6fad1', color: '#209708' },
    sortida: { bg: '#fde8e8', color: '#c0392b' },
    ajust:   { bg: '#fef3cd', color: '#856404' },
  };
  const s = colors[tipus] ?? { bg: '#eee', color: '#666' };
  return (
    <span style={{ ...s, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
      {tipus}
    </span>
  );
};

const OrigenCard = ({ origen }) => {
  if (!origen) return null;
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Origen</h3>
      <div className={styles.grid2}>
        <Field label="Albarà #"    value={origen.albaran_id} />
        <Field label="Data entrada" value={formatData(origen.data_entrada)} />
        <Field label="Proveïdor"    value={origen.proveidor?.nom} />
        <Field label="NIF"          value={origen.proveidor?.nif} />
        <Field label="Usuari"       value={origen.usuari?.nom} />
        <Field label="Estat"        value={origen.estat} />
      </div>
    </div>
  );
};

// ... (imports i resta de components es mantenen igual)

const TaulaMoviments = ({ moviments }) => {
  if (!moviments?.length) return <p className={styles.empty}>Sense moviments registrats.</p>;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipus</th>
            <th>Quantitat</th>
            <th>Usuari</th>
            <th>Recepta</th>
            <th>Observacions</th>
          </tr>
        </thead>
        <tbody>
          {moviments.map((m) => (
            <tr key={m.id}>
              <td>{formatData(m.data)}</td>
              <td><TipusBadge tipus={m.tipus} /></td>
              <td>{m.quantitat}</td>
              <td>{m.usuari ?? '—'}</td>
              <td>
                {m.recepta
                  ? <span>{m.recepta.recepta ?? m.recepta.nom} ({m.recepta.porcions} p.)</span>
                  : '—'}
              </td>
              <td>{m.observacions ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ... (Field, formatData i la resta del codi segueix igual)

const Field = ({ label, value }) => (
  <div>
    <p className={styles.fieldLabel}>{label}</p>
    <p className={styles.fieldValue}>{value ?? '—'}</p>
  </div>
);

const formatData = (d) => d ? new Date(d).toLocaleDateString('ca-ES') : '—';

const ResultatLot = ({ data }) => {
  if (!data || !data.lot) return null;
  return (
    <div className={styles.resultWrap}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Lot</h3>
        <div className={styles.grid2}>
          <Field label="Número lot"  value={data.lot.numero_lot} />
          <Field label="Quantitat"   value={data.lot.quantitat} />
          <Field label="Caducitat"   value={formatData(data.lot.data_caducitat)} />
          <Field label="Producte"    value={data.producte?.nom} />
        </div>
      </div>
      <OrigenCard origen={data.origen} />
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Moviments d'aquest lot</h3>
        <TaulaMoviments moviments={data.moviments} />
      </div>
    </div>
  );
};

const ResultatProducte = ({ data }) => {
  if (!data || !data.producte) return null;
  return (
    <div className={styles.resultWrap}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Producte</h3>
        <div className={styles.grid2}>
          <Field label="Nom"          value={data.producte?.nom} />
          <Field label="Unitat"       value={data.producte?.unitat_mesura} />
          <Field label="Estoc actual" value={data.estoc_actual} />
        </div>
        <div className={styles.resumRow}>
          <span className={styles.resumChip} style={{ background: '#d6fad1', color: '#209708' }}>
            ↑ Entrades: {data.resum?.total_entrades ?? 0}
          </span>
          <span className={styles.resumChip} style={{ background: '#fde8e8', color: '#c0392b' }}>
            ↓ Sortides: {data.resum?.total_sortides ?? 0}
          </span>
          <span className={styles.resumChip} style={{ background: '#fef3cd', color: '#856404' }}>
            ⇄ Ajustos: {data.resum?.total_ajustos ?? 0}
          </span>
        </div>
      </div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Lots rebuts</h3>
        {data.lots_rebuts?.length ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Número lot</th><th>Quantitat</th><th>Caducitat</th>
                  <th>Proveïdor</th><th>Data entrada</th>
                </tr>
              </thead>
              <tbody>
                {data.lots_rebuts.map((l) => (
                  <tr key={l.id}>
                    <td><code>{l.numero_lot}</code></td>
                    <td>{l.quantitat}</td>
                    <td>{formatData(l.data_caducitat)}</td>
                    <td>{l.proveidor}</td>
                    <td>{formatData(l.data_entrada)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className={styles.empty}>Sense lots registrats.</p>}
      </div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Historial de moviments</h3>
        <TaulaMoviments moviments={data.moviments} />
      </div>
    </div>
  );
};

// ── Panel de lots ────────────────────────────────────────────────────────────
const PanelLots = ({ onSelect, lotActiu }) => {
  const [lots, setLots]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtre, setFiltre]     = useState('');

  useEffect(() => {
    tracabilitatList()
      .then(r => setLots(r.data.data))
      .catch((err) => console.error("Error al llistat:", err))
      .finally(() => setLoading(false));
  }, []);

  const lotsFiltrats = lots.filter(l =>
    l.numero_lot?.toLowerCase().includes(filtre.toLowerCase()) ||
    l.producte?.toLowerCase().includes(filtre.toLowerCase()) ||
    l.proveidor?.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className={styles.panelLots}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Lots disponibles</span>
        <span className={styles.panelCount}>{lots.length}</span>
      </div>
      <input
        className={styles.panelInput}
        type="text"
        placeholder="Filtrar..."
        value={filtre}
        onChange={e => setFiltre(e.target.value)}
      />
      <div className={styles.panelList}>
        {loading && <p className={styles.panelEmpty}>Carregant...</p>}
        {!loading && lotsFiltrats.length === 0 && (
          <p className={styles.panelEmpty}>Sense resultats.</p>
        )}
        {lotsFiltrats.map(l => (
          <button
            key={l.id}
            className={`${styles.panelItem} ${lotActiu === l.numero_lot ? styles.panelItemActive : ''}`}
            onClick={() => onSelect(l.numero_lot)}
          >
            <span className={styles.panelLotNum}>{l.numero_lot}</span>
            <span className={styles.panelLotProd}>{l.producte ?? '—'}</span>
            <span className={styles.panelLotMeta}>
              {l.proveidor ?? '—'} · {formatData(l.data_caducitat)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Pàgina principal ─────────────────────────────────────────────────────────
export default function TracabilitatPage() {
  const [mode, setMode]         = useState('lot');
  const [query, setQuery]       = useState('');
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const cercar = async (q) => {
    let val = (q ?? query).trim();
    if (!val) return;
    
    // Opcional: Normalitzar número de lot a majúscules
    if (mode === 'lot') val = val.toUpperCase();

    setLoading(true);
    setError('');
    setResultat(null);
    try {
      const fn  = mode === 'lot' ? tracabilitatLot : tracabilitatProducte;
      const res = await fn(val);
      setResultat(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message ?? 'No s\'ha trobat cap resultat.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLot = (numeroLot) => {
    setMode('lot');
    setQuery(numeroLot);
    cercar(numeroLot);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Traçabilitat</h1>

      <div className={styles.layout}>
        <PanelLots onSelect={handleSelectLot} lotActiu={query} />

        <div className={styles.main}>
          <div className={styles.modeRow}>
            <button
              className={`${styles.modeBtn} ${mode === 'lot' ? styles.modeBtnActive : ''}`}
              onClick={() => { setMode('lot'); setResultat(null); setQuery(''); setError(''); }}
            >
              Per número de lot
            </button>
            <button
              className={`${styles.modeBtn} ${mode === 'producte' ? styles.modeBtnActive : ''}`}
              onClick={() => { setMode('producte'); setResultat(null); setQuery(''); setError(''); }}
            >
              Per ID de producte
            </button>
          </div>

          <div className={styles.searchRow}>
            <input
              type="text"
              className={styles.input}
              placeholder={mode === 'lot' ? 'Número de lot (ex: LOT-2024-001)' : 'ID del producte (ex: 3)'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') cercar(); }}
            />
            <button className={styles.btnCerca} onClick={() => cercar()} disabled={loading}>
              {loading ? 'Cercant...' : 'Cercar'}
            </button>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          {resultat && (
            mode === 'lot'
              ? <ResultatLot data={resultat} />
              : <ResultatProducte data={resultat} />
          )}

          {!resultat && !error && !loading && (
            <div className={styles.emptyState}>
              <p>Selecciona un lot del panell o introdueix un número manualment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}