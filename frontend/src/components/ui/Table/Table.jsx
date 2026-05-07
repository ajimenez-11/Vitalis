import styles from './Table.module.css';

export default function Table({
  columns,
  data,
  renderRow,
  emptyMessage,
  sortKey  = null,
  sortDir  = 'asc',
  onSort   = () => {},
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isActive   = sortKey === col.key;
              const isSortable = !!col.sortable;

              return (
                <th
                  key={col.key}
                  className={[
                    isSortable ? styles.thSortable : '',
                    isActive   ? styles.thActive   : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => isSortable && onSort(col.key)}
                  aria-sort={
                    isActive
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                >
                  <span className={styles.thContent}>
                    {col.label}
                    {isSortable && (
                      <span className={styles.sortIcon} aria-hidden="true">
                        {isActive ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(renderRow)
          )}
        </tbody>
      </table>
    </div>
  );
}