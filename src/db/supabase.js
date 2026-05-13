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

export async function fetchRecords(year, month, type) {
  let q = supabase.from('records').select('*').eq('family_id', familyId())
  if (year !== undefined && month !== undefined) {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
    q = q.like('date', `${prefix}%`)
  }
  if (type) q = q.eq('type', type)
  const { data } = await q.order('date', { ascending: false }).order('created_at', { ascending: false })
  return data || []
}

export async function fetchAllRecords() {
  const { data } = await supabase
    .from('records')
    .select('*')
    .eq('family_id', familyId())
    .order('date', { ascending: false })
  return data || []
}

export async function addRecord(record) {
  const { data } = await supabase
    .from('records')
    .insert({ ...record, family_id: familyId() })
    .select('*')
    .single()
  return data
}

export async function updateRecord(id, changes) {
  await supabase.from('records').update(changes).eq('id', id).eq('family_id', familyId())
}

export async function deleteRecord(id) {
  await supabase.from('records').delete().eq('id', id).eq('family_id', familyId())
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
