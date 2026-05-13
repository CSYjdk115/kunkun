import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function BarChartView({ data }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        暂无数据
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
          formatter={(v) => `¥${Number(v).toFixed(2)}`}
        />
        <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="支出" />
        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="收入" />
      </BarChart>
    </ResponsiveContainer>
  );
}
