
import type {
  RegisterInput,
  RegisterResponse,
  LoginInput,
  LoginResponse,
  VerifyOtpInput,
  VerifyOtpResponse,
} from '../types/auth';

const API_URL = 'http://localhost:3000';

async function handleResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json();

  if (!response.ok) {
    const errorData = data as { message?: string | string[] };

    const message = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message || 'Request failed';

    throw new Error(message);
  }

  return data as T;
}

export async function registerUser(
  input: RegisterInput,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return handleResponse<RegisterResponse>(response);
}

export async function loginUser(
  input: LoginInput,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return handleResponse<LoginResponse>(response);
}


export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<VerifyOtpResponse> {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return handleResponse<VerifyOtpResponse>(response);
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<{
    user: {
      id: number;
      fullName: string;
      email: string;
    };
  }>(response);
}