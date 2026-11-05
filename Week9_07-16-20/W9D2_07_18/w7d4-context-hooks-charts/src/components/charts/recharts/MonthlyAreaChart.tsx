import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { monthlyAnalytics } from '../../../data/analyticsData';

export default function MonthlyAreaChart() {
  return (
    <section className="chart-section">
      <h2>Monthly Task Distribution</h2>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={monthlyAnalytics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Completed area series */}
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.5}
            name="Completed"
            // stackId="taskStack"
          />

          {/* Pending area series */}
          <Area
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.5}
            name="Pending"
            // stackId="taskStack"
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}