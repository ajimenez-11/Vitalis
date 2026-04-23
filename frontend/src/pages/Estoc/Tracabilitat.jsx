import { useState } from 'react';
import { tracabilitatLot, tracabilitatProducte } from '../../api/tracabilitat';
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

// ── Targeta d'origen ────────────────────────────────────────────────────────
const OrigenCard = ({ origen }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>Origen</h3>
    <div className={styles.grid2}>
      <Field label="Albaran #"    value={origen.albaran_id} />
      <Field label="Data entrada" value={formatData(origen.data_entrada)} />
      <Field label="Proveïdor"    value={origen.proveidor?.nom} />
      <Field label="NIF"          value={origen.proveidor?.nif} />
      <Field label="Usuari"       value={origen.usuari?.nom} />
      <Field label="Estat"        value={origen.estat} />
    </div>
  </div>
);

// ── Taula de moviments ──────────────────────────────────────────────────────
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

// ── Helpers ─────────────────────────────────────────────────────────────────
const Field = ({ label, value }) => (
  <div>
    <p className={styles.fieldLabel}>{label}</p>
    <p className={styles.fieldValue}>{value ?? '—'}</p>
  </div>
);

const formatData = (d) => d ? new Date(d).toLocaleDateString('ca-ES') : '—';

// ── Resultat cerca per LOT ───────────────────────────────────────────────────
const ResultatLot = ({ data }) => (
  <div className={styles.resultWrap}>
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Lot</h3>
      <div className={styles.grid2}>
        <Field label="Número lot"     value={data.lot.numero_lot} />
        <Field label="Quantitat"      value={data.lot.quantitat} />
        <Field label="Caducitat"      value={formatData(data.lot.data_caducitat)} />
        <Field label="Producte"       value={data.producte?.nom} />
      </div>
    </div>
    <OrigenCard origen={data.origen} />
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Moviments d'aquest lot</h3>
      <TaulaMoviments moviments={data.moviments} />
    </div>
  </div>
);

// ── Resultat cerca per PRODUCTE ──────────────────────────────────────────────
const ResultatProducte = ({ data }) => (
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
          ↑ Entrades: {data.resum.total_entrades}
        </span>
        <span className={styles.resumChip} style={{ background: '#fde8e8', color: '#c0392b' }}>
          ↓ Sortides: {data.resum.total_sortides}
        </span>
        <span className={styles.resumChip} style={{ background: '#fef3cd', color: '#856404' }}>
          ⇄ Ajustos: {data.resum.total_ajustos}
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
                <th>Número lot</th>
                <th>Quantitat</th>
                <th>Caducitat</th>
                <th>Proveïdor</th>
                <th>Data entrada</th>
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

// ── Pàgina principal ─────────────────────────────────────────────────────────
export default function TracabilitatPage() {
  const [mode, setMode]       = useState('lot');      // 'lot' | 'producte'
  const [query, setQuery]     = useState('');
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleCerca = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResultat(null);
    try {
      const fn  = mode === 'lot' ? tracabilitatLot : tracabilitatProducte;
      const res = await fn(query.trim());
      setResultat(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message ?? 'No s\'ha trobat cap resultat.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleCerca(); };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Traçabilitat</h1>

      {/* Selector de mode */}
      <div className={styles.modeRow}>
        <button
          className={`${styles.modeBtn} ${mode === 'lot' ? styles.modeBtnActive : ''}`}
          onClick={() => { setMode('lot'); setResultat(null); setQuery(''); }}
        >
          Per número de lot
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'producte' ? styles.modeBtnActive : ''}`}
          onClick={() => { setMode('producte'); setResultat(null); setQuery(''); }}
        >
          Per ID de producte
        </button>
      </div>

      {/* Cercador */}
      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.input}
          placeholder={mode === 'lot' ? 'Número de lot (ex: LOT-2024-001)' : 'ID del producte (ex: 3)'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.btnCerca} onClick={handleCerca} disabled={loading}>
          {loading ? 'Cercant...' : 'Cercar'}
        </button>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {resultat && (
        mode === 'lot'
          ? <ResultatLot data={resultat} />
          : <ResultatProducte data={resultat} />
      )}
    </div>
  );
}