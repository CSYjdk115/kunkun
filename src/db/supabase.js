import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

function familyId() {
  return localStorage.getItem('family_id')
}

// ── Family ──

export async function createFamily() {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  const { data, error } = await supabase
    .from('families')
    .insert({ code })
    .select('id, code')
    .single()
  if (error) throw error
  localStorage.setItem('family_id', data.id)
  localStorage.setItem('family_code', data.code)
  return data
}

export async function joinFamily(code) {
  const { data, error } = await supabase
    .from('families')
    .select('id, code')
    .eq('code', code.toUpperCase())
    .single()
  if (error || !data) throw new Error('家庭码不存在')
  localStorage.setItem('family_id', data.id)
  localStorage.setItem('family_code', data.code)
  return data
}

export function getFamilyInfo() {
  return {
    id: localStorage.getItem('family_id'),
    code: localStorage.getItem('family_code'),
  }
}

export function leaveFamily() {
  localStorage.removeItem('family_id')
  localStorage.removeItem('family_code')
}

// ── Categories ──

export async function fetchCategories() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('family_id', familyId())
    .order('created_at')
  return data || []
}

export async function insertDefaultCategories(cats) {
  const rows = cats.map(c => ({ ...c, family_id: familyId() }))
  await supabase.from('categories').insert(rows)
}

export async function addCategory(cat) {
  const { data } = await supabase
    .from('categories')
    .insert({ ...cat, family_id: familyId() })
    .select('*')
    .single()
  return data
}

export async function updateCategory(id, changes) {
  await supabase.from('categories').update(changes).eq('id', id).eq('family_id', familyId())
}

export async function deleteCategory(id) {
  await supabase.from('categories').delete().eq('id', id).eq('family_id', familyId())
}

// ── Records ──

function mapRecord(db) {
  return { id: db.id, type: db.type, amount: Number(db.amount), categoryId: db.category_id, date: db.date, note: db.note, createdAt: db.created_at };
}

export async function fetchRecords(year, month, type) {
  let q = supabase.from('records').select('*').eq('family_id', familyId())
  if (year !== undefined && month !== undefined) {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
    q = q.like('date', `${prefix}%`)
  }
  if (type) q = q.eq('type', type)
  const { data, error } = await q.order('date', { ascending: false }).order('created_at', { ascending: false })
  if (error) { console.error('fetchRecords error:', error); return []; }
  return (data || []).map(mapRecord)
}

export async function fetchAllRecords() {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .eq('family_id', familyId())
    .order('date', { ascending: false })
  if (error) { console.error('fetchAllRecords error:', error); return []; }
  return (data || []).map(mapRecord)
}

export async function addRecord(record) {
  const { data, error } = await supabase
    .from('records')
    .insert({
      type: record.type,
      amount: record.amount,
      category_id: record.categoryId,
      date: record.date,
      note: record.note || '',
      family_id: familyId()
    })
    .select('*')
    .single()
  if (error) throw error
  return mapRecord(data)
}

export async function updateRecord(id, changes) {
  const payload = {}
  if (changes.amount !== undefined) payload.amount = changes.amount
  if (changes.note !== undefined) payload.note = changes.note
  if (changes.categoryId !== undefined) payload.category_id = changes.categoryId
  const { error } = await supabase.from('records').update(payload).eq('id', id).eq('family_id', familyId())
  if (error) throw error
}

export async function deleteRecord(id) {
  const { error } = await supabase.from('records').delete().eq('id', id).eq('family_id', familyId())
  if (error) throw error
}

// ── Budgets ──

export async function fetchBudgets() {
  const { data } = await supabase
    .from('budgets')
    .select('*')
    .eq('family_id', familyId())
  return data || []
}

export async function saveBudget(month, categoryId, amount) {
  const fid = familyId()
  const { data: existing } = await supabase
    .from('budgets')
    .select('id')
    .eq('family_id', fid)
    .eq('month', month)
    .eq('category_id', categoryId)
    .maybeSingle()

  if (existing) {
    if (amount > 0) {
      await supabase.from('budgets').update({ amount }).eq('id', existing.id)
    } else {
      await supabase.from('budgets').delete().eq('id', existing.id)
    }
  } else if (amount > 0) {
    await supabase.from('budgets').insert({ month, category_id: categoryId, amount, family_id: fid })
  }
}
