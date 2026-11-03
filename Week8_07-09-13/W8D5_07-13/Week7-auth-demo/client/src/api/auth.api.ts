import { apiRequest } from './api';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  RegisterResponse,
  User,
} from '../types/auth';

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getCurrentUser(accessToken: string): Promise<{ user: User }> {
  return apiRequest<{ user: User }>('/auth/me', {}, accessToken);
}

export function getAdminMessage(accessToken: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/admin', {}, accessToken);
}


export function refreshSession(): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/refresh', {
    method: 'POST',
  });
}

export function logoutApi(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
}
