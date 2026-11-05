import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { categoryAnalytics } from '../../../data/analyticsData';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#9333ea'];

export default function CategoryPieChart() {
  return (
    <section className="chart-section">
      <h2>Tasks by Category</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={categoryAnalytics}
            dataKey="tasks"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {categoryAnalytics.map((entry, index) => (
              <Cell
                key={entry.category}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}