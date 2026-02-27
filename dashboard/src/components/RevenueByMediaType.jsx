import { useCubeQuery } from "../cubejs-api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export default function RevenueByMediaType() {
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: ["fact_sales.total_revenue"],
    dimensions: ["dim_media_types.media_type_name"],
    order: { "fact_sales.total_revenue": "desc" },
  });

  if (isLoading) return <div className="chart-loading">Loading...</div>;
  if (error) return <div className="chart-error">Error: {error.toString()}</div>;

  const data = resultSet.tablePivot().map((row) => ({
    name: row["dim_media_types.media_type_name"],
    value: parseFloat(row["fact_sales.total_revenue"]),
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="chart-card">
      <h3>Revenue by Media Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value }) =>
              `${name.length > 15 ? name.slice(0, 15) + "..." : name} (${((value / total) * 100).toFixed(1)}%)`
            }
            labelLine={true}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, "Revenue"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
