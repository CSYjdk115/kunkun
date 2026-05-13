import { useState, useMemo } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
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

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    records.forEach(r => {
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [records]);

  // Monthly totals
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
    if (window.confirm('确认删除这条记录？')) {
      await remove(id);
    }
  };

  if (!ready) {
    return <div className="p-8 text-center text-gray-400">加载中...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />

      {/* Summary */}
      <div className="flex gap-3 px-4 mb-3">
        <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-xs text-gray-400 mb-1">支出</div>
          <div className="text-lg font-bold text-red-500">¥{formatAmount(totalExpense)}</div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-xs text-gray-400 mb-1">收入</div>
          <div className="text-lg font-bold text-emerald-500">¥{formatAmount(totalIncome)}</div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-xs text-gray-400 mb-1">结余</div>
          <div className={`text-lg font-bold ${totalIncome - totalExpense >= 0 ? 'text-gray-800' : 'text-red-500'}`}>
            ¥{formatAmount(totalIncome - totalExpense)}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4">
        {grouped.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-3">📝</div>
            <div className="text-sm">暂无记录</div>
          </div>
        ) : (
          grouped.map(([date, items]) => {
            const dayTotal = items.reduce((s, r) => s + (r.type === 'expense' ? -r.amount : r.amount), 0);
            return (
              <div key={date} className="mb-3">
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="text-xs text-gray-500">{formatDate(date)}</span>
                  <span className={`text-xs font-medium ${dayTotal >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    ¥{formatAmount(Math.abs(dayTotal))}
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-t-2xl p-5 w-full max-w-[480px] slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">编辑记录</h3>
              <button onClick={() => setEditing(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">金额</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">备注</label>
                <input
                  type="text"
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <button
                onClick={handleSaveEdit}
                className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium text-sm"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
