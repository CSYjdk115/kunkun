import { useState, useEffect } from 'react';

export default function AmountInput({ value, onChange }) {
  const [display, setDisplay] = useState(() => value ? String(value) : '');

  useEffect(() => {
    if (!value) setDisplay('');
  }, [value]);

  const handleInput = (char) => {
    if (char === '.') {
      if (display.includes('.')) return;
      setDisplay(d => d + '.');
    } else if (char === 'del') {
      setDisplay(d => d.slice(0, -1));
    } else {
      if (display.includes('.') && display.split('.')[1].length >= 2) return;
      if (display === '0' && char !== '.') setDisplay(char);
      else setDisplay(d => d + char);
    }
  };

  const submitDisplay = (str) => {
    const v = parseFloat(str);
    if (!isNaN(v) && v > 0) onChange(v);
  };

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'del'],
  ];

  return (
    <div>
      <div className="text-center py-4">
        <span className="text-4xl font-bold text-gray-800">
          {display || '0'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 px-2">
        {buttons.flat().map((key) => (
          <button
            key={key}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              const newDisplay = key === 'del' ? display.slice(0, -1) : display + key;
              handleInput(key);
              submitDisplay(newDisplay);
            }}
            className={`h-12 rounded-xl text-lg font-medium transition-colors active:scale-95 ${
              key === 'del'
                ? 'bg-gray-100 text-gray-500 text-sm'
                : 'bg-white border border-gray-100 text-gray-700 shadow-sm hover:bg-gray-50'
            }`}
          >
            {key === 'del' ? '⌫' : key}
          </button>
        ))}
      </div>
    </div>
  );
}
