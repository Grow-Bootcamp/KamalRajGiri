import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { monthlyAnalytics } from '../../../data/analyticsData';

export default function MonthlyLineChart() {
  return (
    <section className="chart-section">
      <h2>Monthly Task Trends</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={monthlyAnalytics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Completed tasks trend line */}
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#16a34a"
            strokeWidth={2}
            dot={true}
            name="Completed"
          />

          {/* Pending tasks trend line */}
          <Line
            type="monotone"
            // type = "linear" || step" || monotone
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={true}
            name="Pending"
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}