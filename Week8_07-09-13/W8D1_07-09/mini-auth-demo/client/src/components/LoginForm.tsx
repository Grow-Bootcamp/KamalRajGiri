import { useState } from 'react';
import type { FormEvent } from 'react';
import type { LoginCredentials } from '../types/auth';

export interface LoginFormProps {
    onLogin: (credentials: LoginCredentials) => Promise<void>;
    loading: boolean;
}

export function LoginForm({ onLogin, loading }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onLogin({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '2rem auto' }}>
            <h2>Login</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '0.5rem' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '0.5rem' }}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{ padding: '0.75rem', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}