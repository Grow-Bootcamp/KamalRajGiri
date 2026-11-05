import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell, } from 'recharts'

import { useTodos } from '../../context/TodoContext'

export default function TodoStatusChart() {
    const { todos } = useTodos();

    const completed = todos.filter((todo) => todo.done).length;
    const pending = todos.length - completed;

    const chartData = [
        { name: 'Completed', value: completed },
        { name: 'Pending', value: pending },
    ];

    const COLORS = ['#16a34a', '#f59e0b'];

    if (todos.length === 0) {
        return (
            <section>
                <h2>Todo Status Chart</h2>
                <p>Add some todos to see your chart.</p>
            </section>
        );
    }

    return (
        <section className='chart-section'>
            <h2>Todo Status Chart</h2>
            <ResponsiveContainer width={'100%'} height={280}>
                <PieChart>
                    <Pie data={chartData} dataKey={'value'} nameKey={'name'} cx={'50%'} cy={'50%'} outerRadius={90} label >
                        {chartData.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </section>
    );
}