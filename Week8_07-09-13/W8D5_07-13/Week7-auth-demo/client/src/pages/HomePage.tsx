import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Auth Demo</h1>
      <p>React authentication and role-based authorization.</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </main>
  );
}