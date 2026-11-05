import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { categoryAnalytics } from '../../../data/analyticsData';

export default function HorizontalBarChart() {
  return (
    <section className="chart-section">
      <h2>Tasks by Category</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart layout='vertical' data={categoryAnalytics}>
            <CartesianGrid strokeDasharray={'3 3'} />
            <XAxis type='number' />
            <YAxis dataKey={'category'} type='category' width={100} />
            <Tooltip />
            <Legend />

            <Bar dataKey={'tasks'} fill='#2563eb' name={'Tasks'} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}