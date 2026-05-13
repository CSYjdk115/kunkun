import { useState, useMemo } from 'react';
import { PiggyBank, Target, X } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useRecords } from '../hooks/useRecords';
import { useCategories } from '../hooks/useCategories';
import MonthPicker from '../components/MonthPicker';
import BudgetBar from '../components/BudgetBar';
import { formatAmount } from '../utils/format';

export default function BudgetPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [showEditor, setShowEditor] = useState(false);
  const [editingBudget, setEditingBudget] = useState({ categoryId: null, amount: '' });

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const { budgets, setBudget, getByMonth } = useBudgets();
  const { records } = useRecords({ year, month });
  const { expenseCategories } = useCategories();

  const monthBudgets = getByMonth(monthKey);

  const spendingByCat = useMemo(() => {
    const map = {};
    records.filter(r => r.type === 'expense').forEach(r => {
      if (!map[r.categoryId]) map[r.categoryId] = 0;
      map[r.categoryId] += r.amount;
    });
    return map;
  }, [records]);

  const totalSpent = Object.values(spendingByCat).reduce((s, v) => s + v, 0);
  const totalBudget = monthBudgets.find(b => b.categoryId === null);

  const openEditor = (catId, currentAmount) => {
    setEditingBudget({ categoryId: catId, amount: currentAmount ? String(currentAmount) : '' });
    setShowEditor(true);
  };

  const saveBudget = async () => {
    const amount = parseFloat(editingBudget.amount) || 0;
    await setBudget(monthKey, editingBudget.categoryId, amount);
    setShowEditor(false);
  };

  return (
    <div className="flex flex-col h-full">
      <MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />

      <div className="flex-1 overflow-y-auto px-3">
        {/* Total budget card */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow-sm mb-3">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center">
              <PiggyBank size={17} className="text-pink-500" />
            </div>
            <span className="text-sm font-semibold text-gray-700">🐷 月度总预算</span>
          </div>
          {totalBudget ? (
            <BudgetBar spent={totalSpent} budget={totalBudget.amount} label="总支出" />
          ) : (
            <p className="text-xs text-pink-300 mb-2">还没有设置总预算哦~</p>
          )}
          <button
            onClick={() => openEditor(null, totalBudget?.amount)}
            className="text-xs text-pink-500 font-semibold hover:text-pink-600 transition-colors"
          >
            {totalBudget ? '✏️ 修改总预算' : '➕ 设置总预算'}
          </button>
        </div>

        {/* Category budgets */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow-sm mb-3">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center">
              <Target size={17} className="text-amber-500" />
            </div>
            <span className="text-sm font-semibold text-gray-700">🎯 分类预算</span>
          </div>
          {expenseCategories.map(cat => {
            const budget = monthBudgets.find(b => b.categoryId === cat.id);
            const spent = spendingByCat[cat.id] || 0;
            return (
              <div key={cat.id} onClick={() => openEditor(cat.id, budget?.amount)} className="cursor-pointer group">
                {budget ? (
                  <BudgetBar spent={spent} budget={budget.amount} label={cat.name} />
                ) : (
                  <div className="flex justify-between items-center text-xs mb-3 py-1 group-hover:bg-pink-50/50 rounded-lg px-2 transition-colors -mx-2">
                    <span className="text-gray-600 font-medium">{cat.name}</span>
                    <span className={spent > 0 ? 'text-rose-400' : 'text-gray-400'}>
                      {spent > 0 ? `已花 ¥${spent.toFixed(0)} · ` : ''}
                      <span className="text-pink-400 font-medium">设置预算</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget editor modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => setShowEditor(false)}>
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-[480px] slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>🐷</span>
                {editingBudget.categoryId === null ? '设置总预算' : '设置分类预算'}
              </h3>
              <button onClick={() => setShowEditor(false)} className="p-1.5 hover:bg-pink-50 rounded-full transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-4 bg-pink-50/50 rounded-xl px-3 py-2">
              <span className="text-pink-400 font-bold text-lg">¥</span>
              <input
                type="number"
                value={editingBudget.amount}
                onChange={e => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                placeholder="输入预算金额"
                className="flex-1 text-xl font-bold outline-none bg-transparent text-gray-800 placeholder-pink-200"
                autoFocus
              />
            </div>
            <button
              onClick={saveBudget}
              className="w-full py-3.5 bg-pink-400 text-white rounded-2xl font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-pink-200"
            >
              保存预算
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
