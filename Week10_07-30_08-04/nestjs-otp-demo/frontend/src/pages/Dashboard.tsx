
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../services/authService';

interface User {
  id: number;
  fullName: string;
  email: string;
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    getCurrentUser(token)
      .then((result) => {
        setUser(result.user);
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        toast.error('Session expired. Please log in again.');
        navigate('/login', { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="auth-container">
      <section className="auth-card">
        <h1>Dashboard</h1>

        <h2>Welcome, {user.fullName}!</h2>
        <p>Email: {user.email}</p>
        <p>User ID: {user.id}</p>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </section>
    </main>
  );
}

export default Dashboard;
