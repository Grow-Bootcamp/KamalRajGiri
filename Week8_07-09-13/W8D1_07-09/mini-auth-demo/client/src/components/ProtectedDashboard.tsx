import { useState, useEffect } from 'react';
import { getProfileWithRefresh } from '../services/api';
import type { ProfileResponse } from '../types/auth';

interface ProtectedDashboardProps {
    token: string;
    onTokenRefresh: (newToken: string) => void;
    onLogout: () => void;
}

export function ProtectedDashboard({ token, onTokenRefresh, onLogout }: ProtectedDashboardProps) {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getProfileWithRefresh(token);
                if (isMounted) {
                    setProfile(data.profile);
                    if(data.token !== token){
                        onTokenRefresh(data.token);
                    }
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('An unexpected error occurred while fetching your profile.');
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [token, onTokenRefresh]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard profile...</div>;
    }

    if (error) {
        return (
            <div style={{ backgroundColor: '#ffe6e6', color: '#d9534f', padding: '1rem', borderRadius: '4px', maxWidth: '400px', margin: '2rem auto' }}>
                <p><strong>Error:</strong> {error}</p>
                <button 
                    onClick={onLogout}
                    style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                    Log Out
                </button>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f0f4f8', padding: '2rem', borderRadius: '8px', maxWidth: '400px', margin: '2rem auto' }}>
            <h2>Protected Dashboard</h2>
            {profile && (
                <div style={{ margin: '1rem 0', lineHeight: '1.6' }}>
                    <p style={{ fontStyle: 'italic', color: '#555' }}>"{profile.message}"</p>
                    <p><strong>User ID:</strong> {profile.user.userId}</p>
                    <p><strong>Role:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{profile.user.role}</span></p>
                </div>
            )}
            <button 
                onClick={onLogout}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Log Out
            </button>
        </div>
    );
}