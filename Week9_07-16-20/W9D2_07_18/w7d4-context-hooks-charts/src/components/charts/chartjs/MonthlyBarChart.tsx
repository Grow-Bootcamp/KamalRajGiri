import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

import { monthlyAnalytics } from '../../../data/analyticsData';
import './chartConfig';

const data: ChartData<'bar'> = {
  labels: monthlyAnalytics.map((item) => item.month),

  datasets: [
    {
      label: 'Completed',
      data: monthlyAnalytics.map((item) => item.completed),
      backgroundColor: '#16a34a',
    },
    {
      label: 'Pending',
      data: monthlyAnalytics.map((item) => item.pending),
      backgroundColor: '#f59e0b',
    },
  ],
};

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    title: {
      display: true,
      text: 'Monthly Task Comparison',
    },
    legend: {
      position: 'top',
    },
  },

  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function MonthlyBarChartUsingCharts() {
  return (
    <section className="chart-section">
      <h2>Chart.js Monthly Bar Chart</h2>

      <div style={{ height: 320 }}>
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}