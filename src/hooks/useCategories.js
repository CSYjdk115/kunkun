import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchCategories, addCategory, updateCategory, deleteCategory, insertDefaultCategories } from '../db/supabase';
import { getFamilyInfo } from '../db/supabase';

const defaultCategories = [
  { name: '餐饮', type: 'expense', icon: 'UtensilsCrossed', color: '#f97316' },
  { name: '交通', type: 'expense', icon: 'Car', color: '#3b82f6' },
  { name: '购物', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { name: '娱乐', type: 'expense', icon: 'Gamepad2', color: '#8b5cf6' },
  { name: '住房', type: 'expense', icon: 'Home', color: '#14b8a6' },
  { name: '医疗', type: 'expense', icon: 'HeartPulse', color: '#ef4444' },
  { name: '教育', type: 'expense', icon: 'BookOpen', color: '#6366f1' },
  { name: '其他支出', type: 'expense', icon: 'Ellipsis', color: '#64748b' },
  { name: '工资', type: 'income', icon: 'Briefcase', color: '#22c55e' },
  { name: '奖金', type: 'income', icon: 'Gift', color: '#10b981' },
  { name: '兼职', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { name: '理财', type: 'income', icon: 'TrendingUp', color: '#84cc16' },
  { name: '闲鱼', type: 'income', icon: 'ShoppingBag', color: '#f59e0b' },
  { name: '陪玩', type: 'income', icon: 'Gamepad2', color: '#a855f7' },
  { name: '其他收入', type: 'income', icon: 'Ellipsis', color: '#64748b' },
];

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [ready, setReady] = useState(false);
  const family = getFamilyInfo();

  const load = useCallback(async () => {
    if (!family.id) { setReady(true); return; }
    let all = await fetchCategories();
    if (all.length === 0) {
      await insertDefaultCategories(defaultCategories);
      all = await fetchCategories();
    }
    setCategories(all);
    setReady(true);
  }, [family.id]);

  useEffect(() => { load(); }, [load]);

  // Realtime
  useEffect(() => {
    if (!family.id) return;
    const ch = supabase
      .channel('categories-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'categories', filter: `family_id=eq.${family.id}` },
        () => load()
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [family.id, load]);

  const add = async (cat) => {
    await addCategory(cat);
    await load();
  };

  const update = async (id, data) => {
    await updateCategory(id, data);
    await load();
  };

  const remove = async (id) => {
    await deleteCategory(id);
    await load();
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');
  const getById = useCallback((id) => categories.find(c => c.id === id), [categories]);

  return { categories, expenseCategories, incomeCategories, ready, add, update, remove, getById, reload: load };
}
