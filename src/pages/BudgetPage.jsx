import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { PiggyBank, Target } from 'lucide-react';
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

  // Spending by category
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

      <div className="flex-1 overflow-y-auto px-4">
        {/* Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <PiggyBank size={16} className="text-indigo-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">月度总预算</span>
          </div>
          {totalBudget ? (
            <BudgetBar spent={totalSpent} budget={totalBudget.amount} label="总支出" />
          ) : (
            <p className="text-xs text-gray-400 mb-2">未设置总预算</p>
          )}
          <button
            onClick={() => openEditor(null, totalBudget?.amount)}
            className="text-xs text-indigo-500 font-medium"
          >
            {totalBudget ? '修改总预算' : '设置总预算'}
          </button>
        </div>

        {/* Category budget */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Target size={16} className="text-amber-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">分类预算</span>
          </div>
          {expenseCategories.map(cat => {
            const budget = monthBudgets.find(b => b.categoryId === cat.id);
            const spent = spendingByCat[cat.id] || 0;
            return (
              <div key={cat.id} onClick={() => openEditor(cat.id, budget?.amount)} className="cursor-pointer">
                {budget ? (
                  <BudgetBar spent={spent} budget={budget.amount} label={cat.name} />
                ) : (
                  <div className="flex justify-between text-xs mb-3">
                    <span className="text-gray-600">{cat.name}</span>
                    <span className={`font-medium ${spent > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      已花 ¥{spent.toFixed(0)} · <span className="text-indigo-400">设置预算</span>
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowEditor(false)}>
          <div className="bg-white rounded-t-2xl p-5 w-full max-w-[480px] slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="font-medium text-gray-800 mb-4">
              {editingBudget.categoryId === null ? '设置总预算' : '设置分类预算'}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400">¥</span>
              <input
                type="number"
                value={editingBudget.amount}
                onChange={e => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                placeholder="输入预算金额"
                className="flex-1 text-2xl font-bold outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={saveBudget}
              className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium text-sm"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
