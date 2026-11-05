import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { skillAnalytics } from '../../../data/analyticsData';

export default function SkillRadarChart() {
  return (
    <section className="chart-section">
      <h2>Skill Proficiency Radar</h2>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={skillAnalytics} outerRadius={100}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </section>
  );
}