import TodoStatusChart from "../components/charts/TodoStatusChart";
import MonthlyBarChart from "../components/charts/recharts/MonthlyBarChart";
import HorizontalBarChart from "../components/charts/recharts/HorizontalBarChart";
import StackedBarChart from "../components/charts/recharts/StackedBarChart";
import MonthlyLineChart from "../components/charts/recharts/MonthlyLineChart";
import MonthlyAreaChart from "../components/charts/recharts/MonthlyAreaChart";
import CategoryDonutChart from "../components/charts/recharts/CategoryDoughnutChart";
import SkillRadarChart from "../components/charts/recharts/SkillRadarChart";
import MonthlyComposedChart from "../components/charts/recharts/MonthlyComposedChart";
import MonthlyBarChartUsingCharts from "../components/charts/chartjs/MonthlyBarChart";


export default function Analytics() {
  return (
    <main className="analytics-page">
      <h1>Analytics Dashboard</h1>

      <div className="chart-grid">
        {/* Live Todo State Chart */}
        <TodoStatusChart />

        {/* Recharts Analytics Datasets */}
        <MonthlyBarChart />
        <HorizontalBarChart />
        <StackedBarChart />
        <MonthlyLineChart />
        <MonthlyAreaChart />
        <CategoryDonutChart />
        <SkillRadarChart />
        <MonthlyComposedChart />
        <MonthlyBarChartUsingCharts />
      </div>
    </main>
  );
}