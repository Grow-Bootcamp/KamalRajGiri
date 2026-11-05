import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { categoryAnalytics } from '../../../data/analyticsData';

export default function CategoryDonutChart() {
  const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

  return (
    <section className="chart-section">
      <h2>Task Distribution</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={categoryAnalytics}
            dataKey="tasks"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label
          >
            {categoryAnalytics.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}