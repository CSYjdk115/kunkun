import { Trash2, Pencil } from 'lucide-react';
import { formatAmount } from '../utils/format';

export default function RecordItem({ record, category, onEdit, onDelete }) {
  if (!category) return null;

  const isExpense = record.type === 'expense';

  return (
    <div className="flex items-center gap-3 py-3 px-3 bg-white rounded-xl mb-2 shadow-sm fade-in">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: category.color + '20', color: category.color }}
      >
        <span className="text-lg">{category.icon || '💰'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800">{category.name}</div>
        {record.note && (
          <div className="text-xs text-gray-400 truncate">{record.note}</div>
        )}
      </div>
      <div className={`text-sm font-semibold ${isExpense ? 'text-red-500' : 'text-emerald-500'}`}>
        {isExpense ? '-' : '+'}{formatAmount(record.amount)}
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(record)} className="p-1 text-gray-300 hover:text-indigo-500">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(record.id)} className="p-1 text-gray-300 hover:text-red-500">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
