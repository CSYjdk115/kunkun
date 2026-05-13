import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const all = await db.budgets.toArray();
    setBudgets(all);
    setReady(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  const setBudget = async (month, categoryId, amount) => {
    const existing = await db.budgets.where({ month, categoryId }).first();
    if (existing) {
      if (amount > 0) await db.budgets.update(existing.id, { amount });
      else await db.budgets.delete(existing.id);
    } else if (amount > 0) {
      await db.budgets.add({ month, categoryId, amount });
    }
    await load();
  };

  const getByMonth = useCallback((month) => {
    return budgets.filter(b => b.month === month);
  }, [budgets]);

  return { budgets, ready, setBudget, getByMonth, reload: load };
}
