import { useCubeQuery } from "../cubejs-api";

export default function EmployeePerformance() {
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: [
      "dim_employees.total_revenue",
      "dim_employees.total_invoices_handled",
    ],
    dimensions: ["dim_employees.full_name", "dim_employees.title"],
    order: { "dim_employees.total_revenue": "desc" },
  });

  if (isLoading) return <div className="chart-loading">Loading...</div>;
  if (error) return <div className="chart-error">Error: {error.toString()}</div>;

  const data = resultSet.tablePivot();

  return (
    <div className="chart-card">
      <h3>Employee Performance</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Title</th>
              <th>Revenue</th>
              <th>Invoices</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row["dim_employees.full_name"]}</td>
                <td>{row["dim_employees.title"]}</td>
                <td>${parseFloat(row["dim_employees.total_revenue"] || 0).toFixed(2)}</td>
                <td>{row["dim_employees.total_invoices_handled"] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
