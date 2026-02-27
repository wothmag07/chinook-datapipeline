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

export default function TopArtists() {
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: ["dim_artists.total_revenue", "dim_artists.total_units_sold"],
    dimensions: ["dim_artists.artist_name"],
    order: { "dim_artists.total_revenue": "desc" },
    limit: 10,
  });

  if (isLoading) return <div className="chart-loading">Loading...</div>;
  if (error) return <div className="chart-error">Error: {error.toString()}</div>;

  const data = resultSet.tablePivot().map((row) => ({
    artist: row["dim_artists.artist_name"],
    revenue: parseFloat(row["dim_artists.total_revenue"]),
    units: parseInt(row["dim_artists.total_units_sold"]),
  }));

  return (
    <div className="chart-card">
      <h3>Top 10 Artists by Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(v) => `$${v}`} />
          <YAxis type="category" dataKey="artist" width={120} fontSize={11} />
          <Tooltip
            formatter={(v, name) => [
              name === "revenue" ? `$${v.toFixed(2)}` : v,
              name === "revenue" ? "Revenue" : "Units Sold",
            ]}
          />
          <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
