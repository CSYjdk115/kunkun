import { useState, useRef } from 'react';
import { Download, Upload, Plus, Pencil, Trash2, Check, X, FolderOpen } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useRecords } from '../hooks/useRecords';
import { exportToExcel, exportToCSV, importFromExcel } from '../utils/export';
import { db } from '../db/database';

export default function SettingsPage() {
  const { categories, expenseCategories, incomeCategories, add, update, remove, reload } = useCategories();
  const { getAllRecords } = useRecords();
  const [editingCat, setEditingCat] = useState(null);
  const [newCat, setNewCat] = useState({ name: '', type: 'expense', icon: 'Circle', color: '#6366f1' });
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
            color: row.type === 'expense' ? '#ef4444' : '#22c55e',
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
      alert(`成功导入 ${rows.length} 条记录`);
    } catch (err) {
      alert('导入失败：' + err.message);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">设置</h2>

      {/* Data export/import */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3">数据管理</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium active:scale-[0.98]"
          >
            <Download size={14} /> 导出 Excel
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium active:scale-[0.98]"
          >
            <Download size={14} /> 导出 CSV
          </button>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium mt-2 active:scale-[0.98]"
        >
          <Upload size={14} /> 导入数据
        </button>
        <input ref={fileRef} type="file" accept=".xlsx,.csv" onChange={handleImport} className="hidden" />
      </div>

      {/* Category management */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">支出分类</h3>
          <button onClick={() => { setNewCat({ ...newCat, type: 'expense' }); setShowAddCat(true); }} className="text-indigo-500">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-1">
          {expenseCategories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2 py-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                <FolderOpen size={14} style={{ color: cat.color }} />
              </div>
              <span className="text-sm text-gray-700 flex-1">{cat.name}</span>
              <button onClick={() => setEditingCat(cat)} className="p-1 text-gray-300 hover:text-gray-500">
                <Pencil size={13} />
              </button>
              <button onClick={async () => { if (window.confirm('删除这个分类？')) await remove(cat.id); }} className="p-1 text-gray-300 hover:text-red-500">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">收入分类</h3>
          <button onClick={() => { setNewCat({ ...newCat, type: 'income' }); setShowAddCat(true); }} className="text-indigo-500">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-1">
          {incomeCategories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2 py-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                <FolderOpen size={14} style={{ color: cat.color }} />
              </div>
              <span className="text-sm text-gray-700 flex-1">{cat.name}</span>
              <button onClick={() => setEditingCat(cat)} className="p-1 text-gray-300 hover:text-gray-500">
                <Pencil size={13} />
              </button>
              <button onClick={async () => { if (window.confirm('删除这个分类？')) await remove(cat.id); }} className="p-1 text-gray-300 hover:text-red-500">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {(showAddCat || editingCat) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => { setShowAddCat(false); setEditingCat(null); }}>
          <div className="bg-white rounded-t-2xl p-5 w-full max-w-[480px] slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="font-medium text-gray-800 mb-4">
              {editingCat ? '编辑分类' : '添加分类'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">名称</label>
                <input
                  type="text"
                  value={editingCat ? editingCat.name : newCat.name}
                  onChange={e => editingCat ? setEditingCat({ ...editingCat, name: e.target.value }) : setNewCat({ ...newCat, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">类型</label>
                <div className="flex gap-2">
                  {['expense', 'income'].map(t => (
                    <button
                      key={t}
                      onClick={() => editingCat ? setEditingCat({ ...editingCat, type: t }) : setNewCat({ ...newCat, type: t })}
                      className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${
                        (editingCat ? editingCat.type : newCat.type) === t
                          ? t === 'expense' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {t === 'expense' ? '支出' : '收入'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">颜色</label>
                <div className="flex gap-2 flex-wrap">
                  {['#f97316', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#ef4444', '#6366f1', '#22c55e', '#10b981', '#06b6d4', '#84cc16', '#64748b'].map(c => (
                    <button
                      key={c}
                      onClick={() => editingCat ? setEditingCat({ ...editingCat, color: c }) : setNewCat({ ...newCat, color: c })}
                      className="w-7 h-7 rounded-full border-2 transition-colors"
                      style={{
                        backgroundColor: c,
                        borderColor: (editingCat ? editingCat.color : newCat.color) === c ? '#1e293b' : 'transparent',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowAddCat(false); setEditingCat(null); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm"
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
                      setNewCat({ name: '', type: 'expense', icon: 'Circle', color: '#6366f1' });
                    }
                  }}
                  className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-medium text-sm"
                >保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
