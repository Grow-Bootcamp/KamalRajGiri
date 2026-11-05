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

import { monthlyAnalytics } from '../../../data/analyticsData';

export default function MonthlyBarChart() {
  return (
    <section className="chart-section">
      <h2>Monthly Task Comparison</h2>

      <ResponsiveContainer width="100%" height={320}>
        
        <BarChart data={monthlyAnalytics}>
            <CartesianGrid strokeDasharray={'3 3'} />
            <XAxis dataKey={'month'} />
            <YAxis/>
            <Tooltip />
            <Legend />
            <Bar dataKey={'completed'} fill='#16a34a' name={'Completed'} />
            <Bar dataKey={'pending'} fill='#f59e0b' name={'Pending'} />

        </BarChart>


      </ResponsiveContainer>
    </section>
  );
}