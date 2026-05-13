import { useState, useEffect, useCallback } from 'react';
import { db, initDB } from '../db/database';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    await initDB();
    const all = await db.categories.toArray();
    setCategories(all);
    setReady(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (cat) => {
    const id = await db.categories.add(cat);
    await load();
    return id;
  };

  const update = async (id, data) => {
    await db.categories.update(id, data);
    await load();
  };

  const remove = async (id) => {
    await db.categories.delete(id);
    await load();
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const getById = useCallback((id) => categories.find(c => c.id === id), [categories]);

  return { categories, expenseCategories, incomeCategories, ready, add, update, remove, getById, reload: load };
}
