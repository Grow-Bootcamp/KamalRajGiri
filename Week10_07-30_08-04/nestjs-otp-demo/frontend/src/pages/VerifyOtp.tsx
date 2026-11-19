
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { verifyOtp } from '../services/authService';

interface VerifyLocationState {
  challengeId: string;
  email: string;
  expiresAt: string;
}

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as VerifyLocationState | null;

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Explicitly check for null and missing challenge ID.
  if (state === null || !state.challengeId) {
    return (
      <main className="auth-container">
        <section className="auth-card">
          <h1>Verification session missing</h1>
          <p>Please log in again to receive a new OTP.</p>
          <Link to="/login">Back to Login</Link>
        </section>
      </main>
    );
  }

  // Capture the required values after the null check.
  const { challengeId, email } = state;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);

      const result = await verifyOtp({
        challengeId,
        otp,
      });

      if (result.verified) {
        localStorage.setItem('accessToken', result.accessToken);
        toast.success(result.message);
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'OTP verification failed';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Verify OTP</h1>

        <p>
          Enter the six-digit code for your account:
          <strong> {email}</strong>
        </p>

        <label htmlFor="otp">One-Time Password</label>

        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(event) =>
            setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          pattern="[0-9]{6}"
          required
        />

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </main>
  );
}

export default VerifyOtp;
