"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

type Props = {
  data: [string, number][];
};

export default function BestSellingChart({ data }: Props) {
  const chartData = data.map(([name, quantity]) => ({
    name,
    quantity,
  }));

  const colors = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic py-8 text-center">
        Belum ada data penjualan.
      </p>
    );
  }

  return (
    <div className="h-[250px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 65, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#374151", fontSize: 13, fontWeight: 600 }}
            width={110}
          />
          <Bar dataKey="quantity" radius={[0, 8, 8, 0]} barSize={20}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
            
            {/* 2. Tambahkan LabelList di sini */}
            <LabelList
              dataKey="quantity"
              position="right"
              formatter={(val: number) => `${val} terjual`}
              style={{
                fill: "#6b7280",
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}