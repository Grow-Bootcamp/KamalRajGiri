const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiError{
    message: string;
}

export async function apiRequest<T>(
    endpoint:string,
    options:RequestInit = {},
    accessToken?: string,
): Promise<T>{
    const headers = new Headers(options.headers);

    if (options.body && !headers.has('Content-Type')){
        headers.set('Content-Type', 'application/json');
    }

    if(accessToken){
        headers.set('Authorization',`Bearer ${accessToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`,{
        ...options,
        headers,
        credentials: 'include',
    });

    const data: unknown = await response.json().catch(()=> null);

    if(!response.ok){
        const message = typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' ? data.message : `Request failed with status ${response.status}`;

        throw new Error(message);
    }
    return data as T;
}