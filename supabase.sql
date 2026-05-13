-- 在 Supabase SQL Editor 中执行以下 SQL

-- 家庭表
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分类表
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  icon TEXT NOT NULL DEFAULT 'Circle',
  color TEXT NOT NULL DEFAULT '#f472b6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 记录表
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount DECIMAL NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 预算表
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  category_id UUID,
  amount DECIMAL NOT NULL,
  UNIQUE(family_id, month, category_id)
);

-- 实时同步 (必须开启)
ALTER PUBLICATION supabase_realtime ADD TABLE records;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE budgets;
