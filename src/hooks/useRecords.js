import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';

export function useRecords({ year, month, type } = {}) {
  const [records, setRecords] = useState([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    let query = db.records.orderBy('date').reverse();
    let items = await query.toArray();

    if (year !== undefined && month !== undefined) {
      const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
      items = items.filter(r => r.date.startsWith(prefix));
    }
    if (type) {
      items = items.filter(r => r.type === type);
    }

    setRecords(items);
    setReady(true);
  }, [year, month, type]);

  useEffect(() => { load(); }, [load]);

  const add = async (record) => {
    const id = await db.records.add({ ...record, createdAt: Date.now() });
    await load();
    return id;
  };

  const update = async (id, data) => {
    await db.records.update(id, data);
    await load();
  };

  const remove = async (id) => {
    await db.records.delete(id);
    await load();
  };

  const getByMonth = useCallback(async (y, m) => {
    const prefix = `${y}-${String(m + 1).padStart(2, '0')}`;
    const all = await db.records.orderBy('date').reverse().toArray();
    return all.filter(r => r.date.startsWith(prefix));
  }, []);

  const getAllRecords = useCallback(async () => {
    return await db.records.orderBy('date').reverse().toArray();
  }, []);

  return { records, ready, add, update, remove, getByMonth, getAllRecords, reload: load };
}
