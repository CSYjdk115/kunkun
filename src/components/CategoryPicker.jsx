import { icons } from 'lucide-react';

const iconMap = {};
function getIcon(name) {
  if (!iconMap[name]) iconMap[name] = icons[name];
  return iconMap[name];
}

export default function CategoryPicker({ categories, selected, onSelect }) {
  if (!categories.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <span className="text-3xl block mb-2">🐷</span>
        <span className="text-xs">还没有分类，去设置里添加吧~</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2.5 px-3">
      {categories.map((cat) => {
        const Icon = getIcon(cat.icon);
        const isSelected = selected === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-200 active:scale-90 ${
              isSelected
                ? 'bg-pink-100 ring-2 ring-pink-400 shadow-sm'
                : 'bg-white border border-pink-100/60 hover:border-pink-200 hover:shadow-sm'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isSelected ? 'scale-110' : ''
              }`}
              style={{ backgroundColor: cat.color + '20', color: cat.color }}
            >
              {Icon && <Icon size={22} />}
            </div>
            <span className="text-xs text-gray-600 truncate w-full px-1 text-center font-medium">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
