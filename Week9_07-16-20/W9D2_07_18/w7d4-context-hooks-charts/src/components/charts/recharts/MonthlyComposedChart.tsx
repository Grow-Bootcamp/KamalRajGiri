import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { monthlyAnalytics } from '../../../data/analyticsData';

export default function MonthlyComposedChart() {
  return (
    <section className="chart-section">
      <h2>Monthly Performance Overview</h2>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={monthlyAnalytics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Bar series for completed tasks */}
          <Bar dataKey="completed" fill="#16a34a" name="Completed" />

          {/* Line series for total created tasks */}
          <Line
            type="monotone"
            dataKey="created"
            stroke="#2563eb"
            strokeWidth={2}
            dot={true}
            name="Created"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
}