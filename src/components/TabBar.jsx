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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${
                isActive ? 'text-indigo-500' : 'text-gray-400'
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
