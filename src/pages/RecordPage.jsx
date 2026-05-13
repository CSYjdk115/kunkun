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
      {/* Header */}
      <div className="text-center pt-4 pb-1">
        <span className="text-3xl float inline-block">🐷</span>
        <h1 className="text-xs text-pink-400 font-medium mt-0.5">今天也要记账哦~</h1>
      </div>

      {/* Type toggle */}
      <div className="flex bg-white/60 backdrop-blur mx-3 rounded-2xl p-1 gap-1">
        <button
          onClick={() => { setType('expense'); setCategoryId(null); }}
          className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 ${
            type === 'expense'
              ? 'bg-rose-400 text-white shadow-md shadow-rose-200'
              : 'text-gray-400 hover:text-rose-400'
          }`}
        >💸 支出</button>
        <button
          onClick={() => { setType('income'); setCategoryId(null); }}
          className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 ${
            type === 'income'
              ? 'bg-emerald-400 text-white shadow-md shadow-emerald-200'
              : 'text-gray-400 hover:text-emerald-400'
          }`}
        >💰 收入</button>
      </div>

      {/* Amount input */}
      <div className="bg-white/60 backdrop-blur mx-3 mt-3 rounded-2xl">
        <AmountInput value={amount} onChange={setAmount} />
      </div>

      {/* Category picker */}
      <div className="flex-1 overflow-y-auto py-3 mx-3 mt-3 bg-white/60 backdrop-blur rounded-2xl">
        <div className="text-xs text-pink-400 font-medium mb-3 px-3">
          {type === 'expense' ? '🐽 选择支出分类' : '🐽 选择收入分类'}
        </div>
        <CategoryPicker categories={categories} selected={categoryId} onSelect={setCategoryId} />
      </div>

      {/* Date, note, save */}
      <div className="bg-white/80 backdrop-blur mx-3 mt-3 mb-3 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs text-pink-400 w-10 font-medium">📅 日期</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="text-sm text-gray-700 border-none outline-none bg-transparent flex-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-pink-400 w-10 font-medium">📝 备注</span>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="吃吃喝喝..."
            className="text-sm text-gray-700 border-none outline-none bg-transparent flex-1 placeholder-gray-300"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.97] ${
            canSave
              ? type === 'expense'
                ? 'bg-rose-400 text-white shadow-lg shadow-rose-200 hover:bg-rose-500'
                : 'bg-emerald-400 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-500'
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
