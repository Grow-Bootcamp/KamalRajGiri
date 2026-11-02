
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  login as loginApi,
  refreshSession,
  logoutApi,
} from '../api/auth.api';

import type {
  AuthResponse,
  LoginInput,
  User,
} from '../types/auth';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Share one refresh request across React Strict Mode effect executions.
let refreshPromise: Promise<AuthResponse> | null = null;

function refreshSessionOnce(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session when the application starts.
  useEffect(() => {
    let active = true;

    async function restoreSession(): Promise<void> {
      try {
        const result = await refreshSessionOnce();

        if (active) {
          setUser(result.user);
          setAccessToken(result.accessToken);
        }
      } catch {
        if (active) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(input: LoginInput): Promise<void> {
    const result = await loginApi(input);

    setAccessToken(result.accessToken);
    setUser(result.user);
  }

  async function logout(): Promise<void> {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}
