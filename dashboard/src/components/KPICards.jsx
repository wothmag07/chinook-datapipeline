import { useCubeQuery } from "../cubejs-api";

export default function KPICards() {
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: [
      "fact_sales.total_revenue",
      "fact_sales.count",
      "fact_sales.unique_customers",
      "fact_sales.unique_tracks",
      "fact_sales.unique_invoices",
      "fact_sales.avg_sale_price",
    ],
  });

  if (isLoading) return <div className="chart-loading">Loading KPIs...</div>;
  if (error) return <div className="chart-error">Error: {error.toString()}</div>;

  const row = resultSet.tablePivot()[0];
  const revenue = parseFloat(row["fact_sales.total_revenue"]);
  const invoices = parseInt(row["fact_sales.unique_invoices"]);
  const avgOrderValue = invoices > 0 ? revenue / invoices : 0;

  const kpis = [
    {
      label: "Total Revenue",
      value: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "Total Invoices",
      value: invoices.toLocaleString(),
    },
    {
      label: "Avg Order Value",
      value: `$${avgOrderValue.toFixed(2)}`,
    },
    {
      label: "Unique Customers",
      value: parseInt(row["fact_sales.unique_customers"]).toLocaleString(),
    },
    {
      label: "Tracks Sold",
      value: parseInt(row["fact_sales.unique_tracks"]).toLocaleString(),
    },
    {
      label: "Avg Sale Price",
      value: `$${parseFloat(row["fact_sales.avg_sale_price"]).toFixed(2)}`,
    },
  ];

  return (
    <div className="kpi-row">
      {kpis.map((kpi, i) => (
        <div key={i} className="kpi-card">
          <span className="kpi-value">{kpi.value}</span>
          <span className="kpi-label">{kpi.label}</span>
        </div>
      ))}
    </div>
  );
}
