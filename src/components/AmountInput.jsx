import { useState, useEffect, useCallback } from 'react';

function computeDisplay(current, key) {
  if (key === 'del') return current.slice(0, -1) || '';
  if (key === '.') {
    if (current.includes('.')) return current;
    return current + '.';
  }
  // digit
  if (current.includes('.')) {
    const parts = current.split('.');
    if (parts[1].length >= 2) return current;
    return current + key;
  }
  if (current === '0') return key;
  if (current === '') return key;
  return current + key;
}

export default function AmountInput({ value, onChange }) {
  const [display, setDisplay] = useState(() => value ? String(value) : '');

  useEffect(() => {
    if (!value) setDisplay('');
  }, [value]);

  const handlePress = useCallback((key) => {
    setDisplay(prev => {
      const next = computeDisplay(prev, key);
      const v = parseFloat(next);
      if (!isNaN(v) && v > 0) onChange(v);
      else if (next === '' || next === '0') onChange(null);
      return next;
    });
  }, [onChange]);

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'del'],
  ];

  return (
    <div>
      <div className="text-center py-2">
        <span className="text-3xl font-bold text-pink-600">
          ¥{display || '0'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 px-3 pb-2">
        {buttons.flat().map((key) => (
          <button
            key={key}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handlePress(key);
            }}
            className={`h-9 rounded-xl text-base font-medium transition-all active:scale-90 select-none ${
              key === 'del'
                ? 'bg-pink-50 text-pink-400 text-xs'
                : 'bg-white border border-pink-100 text-gray-700 shadow-sm hover:bg-pink-50/50'
            }`}
          >
            {key === 'del' ? '⌫' : key}
          </button>
        ))}
      </div>
    </div>
  );
}
