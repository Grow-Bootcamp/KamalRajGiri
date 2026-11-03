import { useEffect, useState } from "react";
import { getAdminMessage } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
    const { accessToken } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadAdminMessage() {
            if (!accessToken) {
                setError('Please log in again.');
                setIsLoading(false);
                return;
            }

            try {
                const result = await getAdminMessage(accessToken);
                if (!cancelled) {
                    setMessage(result.message);
                }
            } catch (err: unknown) {
                if(!cancelled){
                    setError(
                    err instanceof Error ? err.message : 'Could not load admin information',
                );
                }
            } finally {
                if(!cancelled){
                    setIsLoading(false);
                }
            }

        }
        void loadAdminMessage();

        return () => {
            cancelled = true;
        };
    },[accessToken]);

    if (isLoading) return <p>Loading admin information...</p>
    if (error) return <p role="alert">{error}</p>

    return(
        <main>
            <h1>Admin Panel</h1>
            <p>{message}</p>
        </main>
    );
}