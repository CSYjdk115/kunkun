import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchBudgets, saveBudget } from '../db/supabase';
import { getFamilyInfo } from '../db/supabase';

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [ready, setReady] = useState(false);
  const family = getFamilyInfo();

  const load = useCallback(async () => {
    if (!family.id) { setReady(true); return; }
    const all = await fetchBudgets();
    setBudgets(all);
    setReady(true);
  }, [family.id]);

  useEffect(() => { load(); }, [load]);

  // Realtime
  useEffect(() => {
    if (!family.id) return;
    const ch = supabase
      .channel('budgets-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'budgets', filter: `family_id=eq.${family.id}` },
        () => load()
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [family.id, load]);

  const setBudget = async (month, categoryId, amount) => {
    await saveBudget(month, categoryId, amount);
    await load();
  };

  const getByMonth = useCallback((month) => {
    return budgets.filter(b => b.month === month);
  }, [budgets]);

  return { budgets, ready, setBudget, getByMonth, reload: load };
}
