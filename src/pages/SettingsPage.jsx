import { useState, useRef } from 'react';
import { Download, Upload, Plus, Pencil, Trash2, X, FolderOpen } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useRecords } from '../hooks/useRecords';
import { exportToExcel, exportToCSV, importFromExcel } from '../utils/export';
import { db } from '../db/database';

export default function SettingsPage() {
  const { categories, expenseCategories, incomeCategories, add, update, remove, reload } = useCategories();
  const { getAllRecords } = useRecords();
  const [editingCat, setEditingCat] = useState(null);
  const [newCat, setNewCat] = useState({ name: '', type: 'expense', icon: 'Circle', color: '#f472b6' });
  const [showAddCat, setShowAddCat] = useState(false);
  const fileRef = useRef(null);

  const handleExportExcel = async () => {
    const records = await getAllRecords();
    await exportToExcel(records, categories);
  };

  const handleExportCSV = async () => {
    const records = await getAllRecords();
    await exportToCSV(records, categories);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const rows = await importFromExcel(file);
      const catMap = {};
      categories.forEach(c => { catMap[c.name] = c.id; });

      for (const row of rows) {
        let catId = catMap[row.categoryName];
        if (!catId) {
          catId = await add({
            name: row.categoryName,
            type: row.type,
            icon: 'Circle',
            color: row.type === 'expense' ? '#f472b6' : '#22c55e',
          });
          catMap[row.categoryName] = catId;
        }
        await db.records.add({
          type: row.type,
          amount: row.amount,
          categoryId: catId,
          date: row.date,
          note: row.note,
          createdAt: Date.now(),
        });
      }
      await reload();
      alert(`🐷 成功导入 ${rows.length} 条记录~`);
    } catch (err) {
      alert('导入失败：' + err.message);
    }
  };

  const colorOptions = [
    '#f472b6', '#ec4899', '#f97316', '#3b82f6', '#8b5cf6',
    '#14b8a6', '#ef4444', '#6366f1', '#22c55e', '#10b981',
    '#06b6d4', '#84cc16', '#f59e0b', '#64748b',
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 py-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">🐷</span>
        <h2 className="text-base font-bold text-pink-500">设置</h2>
      </div>

      {/* Data management */}
      <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📦 数据管理</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold active:scale-95 transition-all hover:bg-emerald-100"
          >
            <Download size={14} /> Excel
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold active:scale-95 transition-all hover:bg-blue-100"
          >
            <Download size={14} /> CSV
          </button>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-semibold mt-2 active:scale-95 transition-all hover:bg-amber-100"
        >
          <Upload size={14} /> 导入 Excel / CSV
        </button>
        <input ref={fileRef} type="file" accept=".xlsx,.csv" onChange={handleImport} className="hidden" />
      </div>

      {/* Expense category management */}
      <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">💸 支出分类</h3>
          <button
            onClick={() => { setNewCat({ ...newCat, type: 'expense' }); setShowAddCat(true); }}
            className="p-1.5 bg-pink-100 text-pink-500 rounded-full hover:bg-pink-200 transition-colors active:scale-90"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-0.5">
          {expenseCategories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2.5 py-2.5 px-2 hover:bg-pink-50/50 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color + '20' }}>
                <FolderOpen size={14} style={{ color: cat.color }} />
              </div>
              <span className="text-sm text-gray-700 flex-1 font-medium">{cat.name}</span>
              <button onClick={() => setEditingCat(cat)} className="p-1.5 text-gray-300 hover:text-pink-400 transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={async () => { if (window.confirm(`确定删除"${cat.name}"分类吗？🐷`)) await remove(cat.id); }} className="p-1.5 text-gray-300 hover:text-rose-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Income category management */}
      <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">💰 收入分类</h3>
          <button
            onClick={() => { setNewCat({ ...newCat, type: 'income' }); setShowAddCat(true); }}
            className="p-1.5 bg-pink-100 text-pink-500 rounded-full hover:bg-pink-200 transition-colors active:scale-90"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-0.5">
          {incomeCategories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2.5 py-2.5 px-2 hover:bg-pink-50/50 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color + '20' }}>
                <FolderOpen size={14} style={{ color: cat.color }} />
              </div>
              <span className="text-sm text-gray-700 flex-1 font-medium">{cat.name}</span>
              <button onClick={() => setEditingCat(cat)} className="p-1.5 text-gray-300 hover:text-pink-400 transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={async () => { if (window.confirm(`确定删除"${cat.name}"分类吗？🐷`)) await remove(cat.id); }} className="p-1.5 text-gray-300 hover:text-rose-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {(showAddCat || editingCat) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => { setShowAddCat(false); setEditingCat(null); }}>
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-[480px] slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>🐷</span>
                {editingCat ? '编辑分类' : '添加分类'}
              </h3>
              <button onClick={() => { setShowAddCat(false); setEditingCat(null); }} className="p-1.5 hover:bg-pink-50 rounded-full transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-pink-400 font-medium block mb-1.5">名称</label>
                <input
                  type="text"
                  value={editingCat ? editingCat.name : newCat.name}
                  onChange={e => editingCat ? setEditingCat({ ...editingCat, name: e.target.value }) : setNewCat({ ...newCat, name: e.target.value })}
                  className="w-full border border-pink-100 rounded-xl p-2.5 text-sm outline-none focus:border-pink-400 transition-colors bg-pink-50/50"
                  placeholder="输入分类名称"
                />
              </div>
              <div>
                <label className="text-xs text-pink-400 font-medium block mb-1.5">类型</label>
                <div className="flex gap-2">
                  {['expense', 'income'].map(t => (
                    <button
                      key={t}
                      onClick={() => editingCat ? setEditingCat({ ...editingCat, type: t }) : setNewCat({ ...newCat, type: t })}
                      className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${
                        (editingCat ? editingCat.type : newCat.type) === t
                          ? t === 'expense' ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-600'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {t === 'expense' ? '💸 支出' : '💰 收入'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-pink-400 font-medium block mb-1.5">颜色</label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map(c => (
                    <button
                      key={c}
                      onClick={() => editingCat ? setEditingCat({ ...editingCat, color: c }) : setNewCat({ ...newCat, color: c })}
                      className="w-7 h-7 rounded-full border-2 transition-all active:scale-90"
                      style={{
                        backgroundColor: c,
                        borderColor: (editingCat ? editingCat.color : newCat.color) === c ? '#1e293b' : 'transparent',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowAddCat(false); setEditingCat(null); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold text-sm active:scale-95 transition-all"
                >取消</button>
                <button
                  onClick={async () => {
                    if (editingCat) {
                      await update(editingCat.id, { name: editingCat.name, type: editingCat.type, color: editingCat.color });
                      setEditingCat(null);
                    } else {
                      if (!newCat.name.trim()) return;
                      await add({ ...newCat, name: newCat.name.trim() });
                      setShowAddCat(false);
                      setNewCat({ name: '', type: 'expense', icon: 'Circle', color: '#f472b6' });
                    }
                  }}
                  className="flex-1 py-3 bg-pink-400 text-white rounded-2xl font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-pink-200"
                >保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
