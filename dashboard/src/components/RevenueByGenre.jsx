import { useCubeQuery } from "../cubejs-api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueByGenre() {
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: ["fact_sales.total_revenue"],
    dimensions: ["dim_genres.genre_name"],
    order: { "fact_sales.total_revenue": "desc" },
    limit: 10,
  });

  if (isLoading) return <div className="chart-loading">Loading...</div>;
  if (error) return <div className="chart-error">Error: {error.toString()}</div>;

  const data = resultSet.tablePivot().map((row) => ({
    genre: row["dim_genres.genre_name"],
    revenue: parseFloat(row["fact_sales.total_revenue"]),
  }));

  return (
    <div className="chart-card">
      <h3>Revenue by Genre (Top 10)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="genre" angle={-25} textAnchor="end" height={80} fontSize={12} />
          <YAxis tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, "Revenue"]} />
          <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
