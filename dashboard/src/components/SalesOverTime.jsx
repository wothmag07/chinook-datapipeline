import { useCubeQuery } from "../cubejs-api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesOverTime() {
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: ["fact_daily_sales.total_revenue"],
    dimensions: ["dim_date.year_month"],
    order: { "dim_date.year_month": "asc" },
  });

  if (isLoading) return <div className="chart-loading">Loading...</div>;
  if (error) return <div className="chart-error">Error: {error.toString()}</div>;

  const data = resultSet.tablePivot().map((row) => ({
    month: row["dim_date.year_month"],
    revenue: parseFloat(row["fact_daily_sales.total_revenue"]),
  }));

  return (
    <div className="chart-card">
      <h3>Monthly Sales Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" angle={-25} textAnchor="end" height={80} fontSize={11} />
          <YAxis tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, "Revenue"]} />
          <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
