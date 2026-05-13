import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function PieChartView({ data }) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2">
        <span className="text-4xl">🐷</span>
        <span className="text-sm text-pink-300">暂无支出数据</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: 'none',
            boxShadow: '0 4px 20px rgba(244,114,182,0.15)',
            fontSize: 13,
          }}
          formatter={(v) => `¥${Number(v).toFixed(2)}`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
