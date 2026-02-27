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

export default function RevenueByCountry() {
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: ["fact_sales.total_revenue"],
    dimensions: ["dim_customers.country"],
    order: { "fact_sales.total_revenue": "desc" },
    limit: 10,
  });

  if (isLoading) return <div className="chart-loading">Loading...</div>;
  if (error) return <div className="chart-error">Error: {error.toString()}</div>;

  const data = resultSet.tablePivot().map((row) => ({
    country: row["dim_customers.country"],
    revenue: parseFloat(row["fact_sales.total_revenue"]),
  }));

  return (
    <div className="chart-card">
      <h3>Revenue by Country (Top 10)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(v) => `$${v}`} />
          <YAxis type="category" dataKey="country" width={100} fontSize={12} />
          <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, "Revenue"]} />
          <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
