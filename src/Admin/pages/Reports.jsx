import { useState } from "react";
import StatsCharts from "../Components/StatsCharts";

const Reports = () => {
  const [chartType, setChartType] = useState("pie");

  const stats = [
    { label: "Total Users", value: 1500 },
    { label: "Active Users", value: 1200 },
    { label: "Withdrawals", value: 450 },
    { label: "Pending KYC", value: 130 },
    { label: "Completed KYC", value: 909 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Statistics & Reports</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Chart Type:</label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="area">Area Chart</option>
          <option value="radar">Radar Chart</option>
        </select>
      </div>

      <StatsCharts stats={stats} type={chartType} />
    </div>
  );
};

export default Reports;
