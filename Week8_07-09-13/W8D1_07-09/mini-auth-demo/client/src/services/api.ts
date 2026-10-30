import type { LoginCredentials, LoginResponse, ProfileResponse } from "../types/auth";

const API_BASE_URL = 'http://localhost:5000/api';

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.error || 'Failed to log in');
    }
    return response.json();
}


let refreshPromise: Promise<LoginResponse> | null = null;
export function refreshAccessToken(): Promise<LoginResponse> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    response.status,
                    errorData.error || 'Failed to refresh access token'
                );
            }

            return response.json() as Promise<LoginResponse>;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

export async function logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.error || 'Failed to log out');
    }
}

export async function getProfile(token: string): Promise<ProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.error || 'Failed to fetch profile.');
    }
    return response.json();
}

export interface ProfileWithTokenResult {
    profile: ProfileResponse;
    token: string;
}

export async function getProfileWithRefresh(token: string): Promise<ProfileWithTokenResult> {
    try {
        const profile = await getProfile(token);
        return { profile, token };
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            // console.log('Profile returned 401; attempting refresh');
            
                const refreshResult = await refreshAccessToken();
                // console.log('Refresh succeed');
                const newToken = refreshResult.token;
                
                const profile = await getProfile(newToken);
                // console.log('Profile retry succeeded');
                return { profile, token: newToken };
            }
            throw error;
        }
}