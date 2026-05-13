import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useRecords } from '../hooks/useRecords';
import { useCategories } from '../hooks/useCategories';
import MonthPicker from '../components/MonthPicker';
import RecordItem from '../components/RecordItem';
import { formatDate, formatAmount } from '../utils/format';

export default function BillsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [editing, setEditing] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');

  const { records, remove, update, ready } = useRecords({ year, month });
  const { getById, expenseCategories, incomeCategories } = useCategories();

  const allCategories = [...expenseCategories, ...incomeCategories];

  const grouped = useMemo(() => {
    const map = {};
    records.forEach(r => {
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [records]);

  const { totalExpense, totalIncome } = useMemo(() => {
    let e = 0, i = 0;
    records.forEach(r => {
      if (r.type === 'expense') e += r.amount;
      else i += r.amount;
    });
    return { totalExpense: e, totalIncome: i };
  }, [records]);

  const handleEdit = (record) => {
    setEditing(record);
    setEditAmount(String(record.amount));
    setEditNote(record.note || '');
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt <= 0) return;
    await update(editing.id, { amount: amt, note: editNote.trim() });
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('确认删除这条记录吗，小猪猪？🐷')) {
      await remove(id);
    }
  };

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <span className="text-5xl animate-bounce">🐷</span>
        <span className="text-sm text-pink-400">加载中...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />

      {/* Summary cards */}
      <div className="flex gap-2 px-3 mb-3">
        <div className="flex-1 bg-white/70 backdrop-blur rounded-2xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-pink-400 mb-1 font-medium">💸 支出</div>
          <div className="text-base font-bold text-rose-400">¥{formatAmount(totalExpense)}</div>
        </div>
        <div className="flex-1 bg-white/70 backdrop-blur rounded-2xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-pink-400 mb-1 font-medium">💰 收入</div>
          <div className="text-base font-bold text-emerald-500">¥{formatAmount(totalIncome)}</div>
        </div>
        <div className="flex-1 bg-white/70 backdrop-blur rounded-2xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-pink-400 mb-1 font-medium">🐷 结余</div>
          <div className={`text-base font-bold ${totalIncome - totalExpense >= 0 ? 'text-pink-600' : 'text-rose-400'}`}>
            ¥{formatAmount(totalIncome - totalExpense)}
          </div>
        </div>
      </div>

      {/* Records list */}
      <div className="flex-1 overflow-y-auto px-3">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl float">🐷</span>
            <span className="text-sm text-pink-300">这个月还没有记录哦~</span>
          </div>
        ) : (
          grouped.map(([date, items]) => {
            const dayExpense = items.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
            const dayIncome = items.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
            return (
              <div key={date} className="mb-3">
                <div className="flex justify-between items-center mb-1.5 px-1">
                  <span className="text-xs text-pink-400 font-medium">{formatDate(date)}</span>
                  <span className="text-xs text-gray-500">
                    {dayExpense > 0 && <span className="text-rose-400">支出 ¥{formatAmount(dayExpense)}</span>}
                    {dayExpense > 0 && dayIncome > 0 && ' · '}
                    {dayIncome > 0 && <span className="text-emerald-500">收入 ¥{formatAmount(dayIncome)}</span>}
                  </span>
                </div>
                {items.map(r => (
                  <RecordItem
                    key={r.id}
                    record={r}
                    category={allCategories.find(c => c.id === r.categoryId)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-[480px] slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>🐷</span> 编辑记录
              </h3>
              <button onClick={() => setEditing(null)} className="p-1.5 hover:bg-pink-50 rounded-full transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-pink-400 font-medium block mb-1.5">金额</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  className="w-full border border-pink-100 rounded-xl p-2.5 text-sm outline-none focus:border-pink-400 transition-colors bg-pink-50/50"
                />
              </div>
              <div>
                <label className="text-xs text-pink-400 font-medium block mb-1.5">备注</label>
                <input
                  type="text"
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  className="w-full border border-pink-100 rounded-xl p-2.5 text-sm outline-none focus:border-pink-400 transition-colors bg-pink-50/50"
                />
              </div>
              <button
                onClick={handleSaveEdit}
                className="w-full py-3.5 bg-pink-400 text-white rounded-2xl font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-pink-200"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
