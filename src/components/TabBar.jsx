import { NavLink } from 'react-router-dom';
import { PencilLine, ReceiptText, ChartPie, PiggyBank, Settings } from 'lucide-react';

const tabs = [
  { to: '/', icon: PencilLine, label: '记账' },
  { to: '/bills', icon: ReceiptText, label: '账单' },
  { to: '/stats', icon: ChartPie, label: '统计' },
  { to: '/budget', icon: PiggyBank, label: '预算' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur border-t border-pink-100 z-50 safe-area-pb rounded-t-2xl shadow-[0_-4px_20px_rgba(244,114,182,0.08)]">
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] transition-all duration-200 ${
                isActive ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-pink-300'
              }`
            }
          >
            <Icon size={22} strokeWidth={1.5} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
