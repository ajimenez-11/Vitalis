import styles from './Table.module.css';

export default function Table({ columns, data, renderRow, emptyMessage }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
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