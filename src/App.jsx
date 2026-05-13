import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { getFamilyInfo } from './db/supabase';
import Layout from './components/Layout';
import RecordPage from './pages/RecordPage';
import BillsPage from './pages/BillsPage';
import StatsPage from './pages/StatsPage';
import BudgetPage from './pages/BudgetPage';
import SettingsPage from './pages/SettingsPage';
import OnboardingPage from './pages/OnboardingPage';

export default function App() {
  const [inFamily, setInFamily] = useState(() => !!getFamilyInfo().id);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setInFamily(!!getFamilyInfo().id);
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!inFamily) {
    return <OnboardingPage onDone={() => setInFamily(true)} />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<RecordPage />} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="settings" element={<SettingsPage onLeave={() => setInFamily(false)} />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
