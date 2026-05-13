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
      <div className="flex bg-white px-2 pt-3 pb-1">
        <button
          onClick={() => { setType('expense'); setCategoryId(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            type === 'expense' ? 'bg-red-500 text-white' : 'text-gray-500'
          }`}
        >支出</button>
        <button
          onClick={() => { setType('income'); setCategoryId(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            type === 'income' ? 'bg-emerald-500 text-white' : 'text-gray-500'
          }`}
        >收入</button>
      </div>

      {/* Amount input */}
      <div className="bg-white pb-3">
        <AmountInput value={amount} onChange={setAmount} />
      </div>

      {/* Category picker */}
      <div className="flex-1 overflow-y-auto py-3 bg-white mt-1">
        <div className="text-xs text-gray-400 mb-2 px-2">选择分类</div>
        <CategoryPicker categories={categories} selected={categoryId} onSelect={setCategoryId} />
      </div>

      {/* Date, note, save */}
      <div className="bg-white border-t p-3 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-10">日期</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="text-sm text-gray-700 border-none outline-none bg-transparent flex-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-10">备注</span>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="添加备注..."
            className="text-sm text-gray-700 border-none outline-none bg-transparent flex-1 placeholder-gray-300"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${
            canSave
              ? type === 'expense' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {saved ? <Check size={18} className="inline" /> : '记录'}
        </button>
      </div>
    </div>
  );
}
