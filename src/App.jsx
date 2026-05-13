import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RecordPage from './pages/RecordPage';
import BillsPage from './pages/BillsPage';
import StatsPage from './pages/StatsPage';
import BudgetPage from './pages/BudgetPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<RecordPage />} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
