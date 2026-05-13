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
    <div className="flex items-center justify-center gap-3 py-3">
      <button onClick={prev} className="p-1 text-gray-500 hover:text-gray-700">
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-medium text-gray-700 w-28 text-center">
        {formatMonth(`${year}-${String(month + 1).padStart(2, '0')}-01`)}
      </span>
      <button onClick={next} className="p-1 text-gray-500 hover:text-gray-700">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
