export default function BudgetBar({ spent, budget, label }) {
  const pct = budget > 0 ? Math.min(spent / budget * 100, 100) : 0;
  const overBudget = spent > budget && budget > 0;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={overBudget ? 'text-rose-400 font-semibold' : 'text-gray-500'}>
          ¥{spent.toFixed(0)} / ¥{budget.toFixed(0)}
        </span>
      </div>
      <div className="h-2.5 bg-pink-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            overBudget ? 'bg-rose-400' : pct > 80 ? 'bg-amber-400' : 'bg-pink-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
