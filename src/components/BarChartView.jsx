import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function BarChartView({ data }) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2">
        <span className="text-4xl">🐷</span>
        <span className="text-sm text-pink-300">暂无趋势数据</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#f9a8d4" />
        <YAxis tick={{ fontSize: 12 }} stroke="#f9a8d4" />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: 'none',
            boxShadow: '0 4px 20px rgba(244,114,182,0.15)',
            fontSize: 13,
          }}
          formatter={(v) => `¥${Number(v).toFixed(2)}`}
        />
        <Bar dataKey="expense" fill="#f472b6" radius={[4, 4, 0, 0]} name="支出" />
        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="收入" />
      </BarChart>
    </ResponsiveContainer>
  );
}
