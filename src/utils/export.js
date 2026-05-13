import * as XLSX from 'xlsx';
import { format } from 'date-fns';

function recordsToSheet(records, categories) {
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });

  const data = [['日期', '类型', '分类', '金额', '备注']];
  records.forEach(r => {
    data.push([
      r.date,
      r.type === 'expense' ? '支出' : '收入',
      catMap[r.categoryId]?.name || '未知',
      r.amount,
      r.note || '',
    ]);
  });
  return XLSX.utils.aoa_to_sheet(data);
}

export async function exportToExcel(records, categories, filename) {
  const ws = recordsToSheet(records, categories);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '账单');
  XLSX.writeFile(wb, filename || `记账数据_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}

export async function exportToCSV(records, categories, filename) {
  const ws = recordsToSheet(records, categories);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `记账数据_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        // Skip header, find matching categories
        resolve(rows.slice(1).filter(r => r[0] && r[3]).map(r => ({
          date: r[0],
          type: r[1] === '支出' ? 'expense' : 'income',
          categoryName: r[2],
          amount: parseFloat(r[3]) || 0,
          note: r[4] || '',
        })));
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
