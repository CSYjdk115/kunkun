import { Trash2, Pencil } from 'lucide-react';
import { icons } from 'lucide-react';
import { formatAmount } from '../utils/format';

const iconCache = {};
function getIcon(name) {
  if (!name) return null;
  if (!iconCache[name]) iconCache[name] = icons[name];
  return iconCache[name];
}

export default function RecordItem({ record, category, onEdit, onDelete }) {
  if (!category) return null;

  const isExpense = record.type === 'expense';
  const Icon = getIcon(category.icon);

  return (
    <div className="flex items-center gap-3 py-3 px-3 bg-white rounded-2xl mb-2 shadow-sm fade-in">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: category.color + '20', color: category.color }}
      >
        {Icon ? <Icon size={20} /> : <span className="text-lg">🐷</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800">{category.name}</div>
        {record.note && (
          <div className="text-xs text-gray-400 truncate">{record.note}</div>
        )}
      </div>
      <div className={`text-sm font-semibold ${isExpense ? 'text-rose-400' : 'text-emerald-500'}`}>
        {isExpense ? '-' : '+'}{formatAmount(record.amount)}
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(record)} className="p-1.5 text-gray-300 hover:text-pink-400 transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(record.id)} className="p-1.5 text-gray-300 hover:text-rose-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
