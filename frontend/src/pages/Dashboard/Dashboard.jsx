import { useApi } from '../../hooks/useApi';
import { getDashboard } from '../../api/dashboard';
import { Badge, PageHeader } from '../../components/ui';
import styles from './Dashboard.module.css';

function KpiCard({ label, value, icon, alert }) {
  return (
    <div className={`${styles.kpi} ${alert ? styles.kpiAlert : ''}`}>
      <span className={styles.kpiIcon}>{icon}</span>
      <div className={styles.kpiBody}>
        <span className={styles.kpiValue}>{value}</span>
        <span className={styles.kpiLabel}>{label}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error } = useApi(getDashboard);

  if (loading) return <div className={styles.status}>Carregant dashboard…</div>;
  if (error) return <div className={`${styles.status} ${styles.error}`}>{error}</div>;

  const {
    stock_baix = [],
    lots_proxims_caducitat = [],
    moviments_recents = [],
    receptes_mes_consumides = [],
    albarans_recents = [],
  } = data ?? {};

  return (
    <div className={styles.page}>
      <PageHeader
        title="Dashboard"
        subtitle="Resum de l'activitat del sistema"
      />

      <section className={styles.kpis}>
        <KpiCard label="Sota mínims" value={stock_baix.length} icon="⚠️" alert={stock_baix.length > 0} />
        <KpiCard label="Lots per caducar" value={lots_proxims_caducitat.length} icon="📅" alert={lots_proxims_caducitat.length > 0} />
        <KpiCard label="Moviments recents" value={moviments_recents.length} icon="📦" />
        <KpiCard label="Receptes actives"  value={receptes_mes_consumides.length} icon="🍽️" />
      </section>

      <div className={styles.grid}>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>⚠️ Productes sota mínims</h2>
          {stock_baix.length === 0 ? (
            <p className={styles.empty}>Tot l'estoc és correcte ✓</p>
          ) : (
            <ul className={styles.list}>
              {stock_baix.map((p) => (
                <li key={p.id} className={styles.listItem}>
                  <span className={styles.itemName}>{p.nom}</span>
                  <Badge variant="danger">
                    {p.estoc_actual} / {p.estoc_minim} {p.unitat_mesura}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>📋 Albarans recents</h2>
          {albarans_recents.length === 0 ? (
            <p className={styles.empty}>Cap albaran registrat</p>
          ) : (
            <ul className={styles.list}>
              {albarans_recents.map((a) => (
                <li key={a.id} className={styles.listItem}>
                  <span className={styles.itemName}>
                    #{a.id} — {a.proveidor?.nom ?? '—'}
                  </span>
                  <div className={styles.itemRight}>
                    <span className={styles.info}>
                      {new Date(a.data).toLocaleDateString('ca-ES')}
                    </span>
                    <Badge variant={a.estat === 'confirmat' ? 'success' : 'warning'}>
                      {a.estat}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>📅 Lots propers a caducar (7 dies)</h2>
          {lots_proxims_caducitat.length === 0 ? (
            <p className={styles.empty}>Cap lot pròxim a caducar ✓</p>
          ) : (
            <ul className={styles.list}>
              {lots_proxims_caducitat.map((lot) => (
                <li key={lot.id} className={styles.listItem}>
                  <span className={styles.itemName}>
                    {lot.linia_albaran?.producte?.nom ?? '—'}
                    <span className={styles.lotNum}> · Lot {lot.numero_lot}</span>
                  </span>
                  <Badge variant="danger">
                    {new Date(lot.data_caducitat).toLocaleDateString('ca-ES')}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>🍽️ Receptes més consumides</h2>
          {receptes_mes_consumides.length === 0 ? (
            <p className={styles.empty}>Cap producció registrada</p>
          ) : (
            <ul className={styles.list}>
              {receptes_mes_consumides.map((r) => (
                <li key={r.recepta_id} className={styles.listItem}>
                  <span className={styles.itemName}>{r.nom}</span>
                  <Badge variant="success">{r.total_porcions} porcions</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${styles.card} ${styles.cardWide}`}>
          <h2 className={styles.cardTitle}>📦 Moviments recents d'estoc</h2>
          {moviments_recents.length === 0 ? (
            <p className={styles.empty}>Cap moviment registrat</p>
          ) : (
            <ul className={styles.list}>
              {moviments_recents.map((m) => (
                <li key={m.id} className={styles.listItem}>
                  <span className={styles.itemName}>{m.producte?.nom ?? '—'}</span>
                  <div className={styles.itemRight}>
                    <span className={styles.info}>{m.usuari?.nom ?? '—'}</span>
                    <Badge variant={
                      m.tipus === 'entrada' ? 'success'
                      : m.tipus === 'sortida' ? 'danger'
                      : 'warning'
                    }>
                      {m.tipus}
                    </Badge>
                    <span className={styles.info}>
                      {m.quantitat} · {new Date(m.created_at).toLocaleDateString('ca-ES')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  );
}