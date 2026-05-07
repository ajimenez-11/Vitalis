import { useState, useMemo } from 'react';

export function useSortable(data, columns) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    const col = columns.find((c) => c.key === key);
    if (!col?.sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey || !data) return data ?? [];
    const col = columns.find((c) => c.key === sortKey);
    return [...data].sort((a, b) => {
      let va = col?.sortValue ? col.sortValue(a) : (a[sortKey] ?? '');
      let vb = col?.sortValue ? col.sortValue(b) : (b[sortKey] ?? '');
      if (typeof va === 'string') va = va.toLowerCase().trim();
      if (typeof vb === 'string') vb = vb.toLowerCase().trim();
      if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
        va = Number(va);
        vb = Number(vb);
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir, columns]);

  return { sorted, sortKey, sortDir, handleSort };
}