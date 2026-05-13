import { icons } from 'lucide-react';

const iconMap = {};
function getIcon(name) {
  if (!iconMap[name]) iconMap[name] = icons[name];
  return iconMap[name];
}

export default function CategoryPicker({ categories, selected, onSelect }) {
  if (!categories.length) return null;

  return (
    <div className="grid grid-cols-4 gap-2 px-2">
      {categories.map((cat) => {
        const Icon = getIcon(cat.icon);
        const isSelected = selected === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all active:scale-95 ${
              isSelected ? 'bg-indigo-50 ring-2 ring-indigo-300' : 'bg-white border border-gray-100'
            }`}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cat.color + '20', color: cat.color }}
            >
              {Icon && <Icon size={20} />}
            </div>
            <span className="text-xs text-gray-600 truncate w-full px-1 text-center">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
