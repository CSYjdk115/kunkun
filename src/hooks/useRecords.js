import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchRecords, fetchAllRecords, addRecord, updateRecord, deleteRecord } from '../db/supabase';
import { getFamilyInfo } from '../db/supabase';

export function useRecords({ year, month, type } = {}) {
  const [records, setRecords] = useState([]);
  const [ready, setReady] = useState(false);
  const family = getFamilyInfo();

  const load = useCallback(async () => {
    if (!family.id) { setReady(true); return; }
    const items = await fetchRecords(year, month, type);
    setRecords(items);
    setReady(true);
  }, [family.id, year, month, type]);

  useEffect(() => { load(); }, [load]);

  // Realtime
  useEffect(() => {
    if (!family.id) return;
    const ch = supabase
      .channel('records-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'records', filter: `family_id=eq.${family.id}` },
        () => load()
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [family.id, load]);

  const add = async (record) => {
    await addRecord(record);
    await load();
  };

  const update = async (id, data) => {
    await updateRecord(id, data);
    await load();
  };

  const remove = async (id) => {
    await deleteRecord(id);
    await load();
  };

  const getByMonth = useCallback(async (y, m) => {
    return await fetchRecords(y, m);
  }, []);

  const getAllRecords = useCallback(async () => {
    return await fetchAllRecords();
  }, []);

  return { records, ready, add, update, remove, getByMonth, getAllRecords, reload: load };
}
