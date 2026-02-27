import { useCubeQuery } from "../cubejs-api";

export default function TopCustomers() {
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: ["fact_sales.total_revenue", "fact_sales.unique_invoices"],
    dimensions: ["dim_customers.full_name", "dim_customers.country"],
    order: { "fact_sales.total_revenue": "desc" },
    limit: 10,
  });

  if (isLoading) return <div className="chart-loading">Loading...</div>;
  if (error) return <div className="chart-error">Error: {error.toString()}</div>;

  const data = resultSet.tablePivot();

  return (
    <div className="chart-card">
      <h3>Top 10 Customers</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Country</th>
              <th>Revenue</th>
              <th>Invoices</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{row["dim_customers.full_name"]}</td>
                <td>{row["dim_customers.country"]}</td>
                <td>${parseFloat(row["fact_sales.total_revenue"]).toFixed(2)}</td>
                <td>{row["fact_sales.unique_invoices"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
