import { Outlet } from 'react-router-dom';
import TabBar from './TabBar';

export default function Layout() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <main className="flex-1 overflow-y-auto pb-14">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
