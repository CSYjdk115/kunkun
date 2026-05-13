import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonth } from '../utils/format';

export default function MonthPicker({ year, month, onChange }) {
  const prev = () => {
    const d = new Date(year, month - 1);
    onChange(d.getFullYear(), d.getMonth());
  };
  const next = () => {
    const d = new Date(year, month + 1);
    onChange(d.getFullYear(), d.getMonth());
  };

  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <button
        onClick={prev}
        className="p-2 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all active:scale-90"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-semibold text-gray-700 w-28 text-center">
        {formatMonth(`${year}-${String(month + 1).padStart(2, '0')}-01`)}
      </span>
      <button
        onClick={next}
        className="p-2 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all active:scale-90"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
