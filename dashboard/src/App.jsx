import cubejsApi from "./cubejs-api";
import KPICards from "./components/KPICards";
import RevenueByGenre from "./components/RevenueByGenre";
import SalesOverTime from "./components/SalesOverTime";
import TopCustomers from "./components/TopCustomers";
import RevenueByCountry from "./components/RevenueByCountry";
import RevenueByMediaType from "./components/RevenueByMediaType";
import TopArtists from "./components/TopArtists";
import EmployeePerformance from "./components/EmployeePerformance";
import "./App.css";

function App() {
  if (!cubejsApi) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Chinook Music Store Analytics</h1>
          <p style={{ color: "#dc2626" }}>
            Cube API credentials not found. Please set VITE_CUBE_API_URL and
            VITE_CUBE_API_TOKEN in dashboard/.env and restart the dev server.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Chinook Music Store Analytics</h1>
        <p>Powered by Cube Cloud + BigQuery + dbt</p>
      </header>

      <KPICards />

      <div className="chart-grid">
        <RevenueByGenre />
        <RevenueByMediaType />
      </div>

      <div className="chart-grid single">
        <SalesOverTime />
      </div>

      <div className="chart-grid">
        <RevenueByCountry />
        <TopArtists />
      </div>

      <div className="chart-grid">
        <TopCustomers />
        <EmployeePerformance />
      </div>
    </div>
  );
}

export default App;
