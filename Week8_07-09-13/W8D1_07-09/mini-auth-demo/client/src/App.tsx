import { useCallback, useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { ProtectedDashboard } from './components/ProtectedDashboard';
import { login,logout as apiLogout } from './services/api';
import type { LoginCredentials } from './types/auth';

export function App() {
    // 1. Initialize token from localStorage so it persists on refresh
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('auth_token');
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);

        try {
            const data = await login(credentials);
            setToken(data.token);
            // 2. Save token to localStorage on successful login
            localStorage.setItem('auth_token', data.token);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred during login.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTokenRefresh = useCallback((newToken: string) => {
        setToken(newToken);
        localStorage.setItem('auth_token', newToken);
    },[]);
    const handleLogout = async () => {
        try{
            await apiLogout();
        }catch(err){
            console.log('Server logout failed',err);
        }finally {
            setToken(null);
            setError(null);
            localStorage.removeItem('auth_token');
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1>Mini Auth Demo</h1>
            </header>

            {error && (
                <div style={{ backgroundColor: '#ffe6e6', color: '#d9534f', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {!token ? (
                <LoginForm onLogin={handleLogin} loading={loading} />
            ) : (
                <ProtectedDashboard token={token} onTokenRefresh={handleTokenRefresh} onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;