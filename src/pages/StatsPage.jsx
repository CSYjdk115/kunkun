import { useState, useMemo, useEffect } from 'react';
import { useRecords } from '../hooks/useRecords';
import { useCategories } from '../hooks/useCategories';
import MonthPicker from '../components/MonthPicker';
import PieChartView from '../components/PieChartView';
import BarChartView from '../components/BarChartView';
import { formatAmount } from '../utils/format';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';

export default function StatsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [mode, setMode] = useState('pie');
  const [allRecords, setAllRecords] = useState([]);

  const { records, ready, getAllRecords } = useRecords({ year, month });
  const { expenseCategories, getById } = useCategories();

  useEffect(() => {
    getAllRecords().then(setAllRecords);
  }, [year, month, getAllRecords]);

  const pieData = useMemo(() => {
    const map = {};
    records.filter(r => r.type === 'expense').forEach(r => {
      if (!map[r.categoryId]) map[r.categoryId] = 0;
      map[r.categoryId] += r.amount;
    });
    return Object.entries(map)
      .map(([catId, value]) => {
        const cat = getById(Number(catId));
        return { name: cat?.name || '未知', value, color: cat?.color || '#ccc' };
      })
      .sort((a, b) => b.value - a.value);
  }, [records, getById]);

  const barData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(year, month), 5),
      end: new Date(year, month),
    });
    return months.map(m => {
      const prefix = format(m, 'yyyy-MM');
      let expense = 0, income = 0;
      allRecords.forEach(r => {
        if (r.date.startsWith(prefix)) {
          if (r.type === 'expense') expense += r.amount;
          else income += r.amount;
        }
      });
      return { month: format(m, 'M月'), expense, income };
    });
  }, [allRecords, year, month]);

  const totalExpense = records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const totalIncome = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <span className="text-5xl animate-bounce">🐷</span>
        <span className="text-sm text-pink-400">加载中...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />

      <div className="flex gap-2 px-3 mb-3">
        <div className="flex-1 bg-white/70 backdrop-blur rounded-2xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-pink-400 mb-1 font-medium">💸 支出</div>
          <div className="text-base font-bold text-rose-400">¥{formatAmount(totalExpense)}</div>
        </div>
        <div className="flex-1 bg-white/70 backdrop-blur rounded-2xl p-3 text-center shadow-sm">
          <div className="text-[10px] text-pink-400 mb-1 font-medium">💰 收入</div>
          <div className="text-base font-bold text-emerald-500">¥{formatAmount(totalIncome)}</div>
        </div>
      </div>

      <div className="flex mx-3 mb-3 bg-white/60 rounded-xl p-0.5">
        <button
          onClick={() => setMode('pie')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
            mode === 'pie' ? 'bg-pink-400 text-white shadow-sm' : 'text-gray-400 hover:text-pink-400'
          }`}
        >🥧 分类饼图</button>
        <button
          onClick={() => setMode('bar')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
            mode === 'bar' ? 'bg-pink-400 text-white shadow-sm' : 'text-gray-400 hover:text-pink-400'
          }`}
        >📊 月度趋势</button>
      </div>

      <div className="bg-white/70 backdrop-blur mx-3 rounded-2xl p-4 shadow-sm">
        {mode === 'pie' ? <PieChartView data={pieData} /> : <BarChartView data={barData} />}
      </div>

      {mode === 'pie' && pieData.length > 0 && (
        <div className="mx-3 mt-3 bg-white/70 backdrop-blur rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-pink-400 mb-3">🐽 支出排行榜</div>
          {pieData.slice(0, 6).map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2">
              <span className={`text-xs font-bold w-5 ${
                i === 0 ? 'text-pink-500' : i === 1 ? 'text-pink-400' : i === 2 ? 'text-pink-300' : 'text-gray-400'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </span>
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-700 flex-1">{item.name}</span>
              <span className="text-sm text-gray-600 font-medium">¥{formatAmount(item.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
