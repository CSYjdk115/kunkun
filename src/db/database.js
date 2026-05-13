import Dexie from 'dexie';

const db = new Dexie('bookkeeping');

db.version(1).stores({
  categories: '++id, type',
  records: '++id, type, categoryId, date',
  budgets: '++id, month, categoryId',
});

// Default categories
const defaultCategories = [
  { name: '餐饮', type: 'expense', icon: 'UtensilsCrossed', color: '#f97316' },
  { name: '交通', type: 'expense', icon: 'Car', color: '#3b82f6' },
  { name: '购物', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { name: '娱乐', type: 'expense', icon: 'Gamepad2', color: '#8b5cf6' },
  { name: '住房', type: 'expense', icon: 'Home', color: '#14b8a6' },
  { name: '医疗', type: 'expense', icon: 'HeartPulse', color: '#ef4444' },
  { name: '教育', type: 'expense', icon: 'BookOpen', color: '#6366f1' },
  { name: '其他支出', type: 'expense', icon: 'Ellipsis', color: '#64748b' },
  { name: '工资', type: 'income', icon: 'Briefcase', color: '#22c55e' },
  { name: '奖金', type: 'income', icon: 'Gift', color: '#10b981' },
  { name: '兼职', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { name: '理财', type: 'income', icon: 'TrendingUp', color: '#84cc16' },
  { name: '其他收入', type: 'income', icon: 'Ellipsis', color: '#64748b' },
];

export async function initDB() {
  const count = await db.categories.count();
  if (count === 0) {
    await db.categories.bulkAdd(defaultCategories);
  }
}

export { db };
