import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useRecords } from '../hooks/useRecords';
import AmountInput from '../components/AmountInput';
import CategoryPicker from '../components/CategoryPicker';

export default function RecordPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [date, setDate] = useState(today);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const { expenseCategories, incomeCategories } = useCategories();
  const { add } = useRecords();

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSave = useCallback(async () => {
    if (!amount || amount <= 0 || !categoryId) return;
    await add({ type, amount, categoryId, date, note: note.trim() });
    setAmount(null);
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [amount, categoryId, type, date, note, add]);

  const canSave = amount && amount > 0 && categoryId;

  return (
    <div className="flex flex-col h-full">
      {/* Type toggle */}
      <div className="flex bg-white/60 backdrop-blur mx-3 mt-3 rounded-xl p-1 gap-1 shrink-0">
        <button
          onClick={() => { setType('expense'); setCategoryId(null); }}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
            type === 'expense'
              ? 'bg-rose-400 text-white shadow-sm'
              : 'text-gray-400 hover:text-rose-400'
          }`}
        >💸 支出</button>
        <button
          onClick={() => { setType('income'); setCategoryId(null); }}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
            type === 'income'
              ? 'bg-emerald-400 text-white shadow-sm'
              : 'text-gray-400 hover:text-emerald-400'
          }`}
        >💰 收入</button>
      </div>

      {/* Amount input - compact numpad */}
      <div className="bg-white/60 backdrop-blur mx-3 mt-2 rounded-xl shrink-0">
        <AmountInput value={amount} onChange={setAmount} />
      </div>

      {/* Date & note - compact single row */}
      <div className="flex items-center gap-2 mx-3 mt-2 shrink-0">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="text-xs text-gray-600 border-none outline-none bg-white/60 backdrop-blur rounded-xl px-3 py-2 min-w-0 w-28"
        />
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="备注"
          className="text-xs text-gray-600 border-none outline-none bg-white/60 backdrop-blur rounded-xl px-3 py-2 flex-1 min-w-0 placeholder-gray-300"
        />
      </div>

      {/* Category picker - gets all remaining space */}
      <div className="flex-1 overflow-y-auto mx-3 mt-2 bg-white/60 backdrop-blur rounded-xl py-2 min-h-0">
        <div className="text-[10px] text-pink-400 font-medium mb-2 px-3">
          {type === 'expense' ? '🐽 选择支出分类' : '🐽 选择收入分类'}
        </div>
        <CategoryPicker categories={categories} selected={categoryId} onSelect={setCategoryId} />
      </div>

      {/* Save button - compact */}
      <div className="mx-3 mt-2 mb-3 shrink-0">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] ${
            canSave
              ? type === 'expense'
                ? 'bg-rose-400 text-white shadow-lg shadow-rose-200'
                : 'bg-emerald-400 text-white shadow-lg shadow-emerald-200'
              : 'bg-pink-100 text-pink-300'
          }`}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-1 bounce-in">
              <Check size={18} /> 记录成功~
            </span>
          ) : (
            type === 'expense' ? '💸 记录支出' : '💰 记录收入'
          )}
        </button>
      </div>
    </div>
  );
}
