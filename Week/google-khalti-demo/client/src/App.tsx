
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

type User = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

type PaymentStatusResponse = {
  paid: boolean;
};

// 1. Login page
function Login() {
  function handleGoogleLogin() {
    window.location.href = `${API_URL}/api/auth/google`;
  }

  return (
    <main className="app">
      <div className="container">
        <header className="page-header">
          <h1>Google Khalti Demo</h1>
          <p>Secure authentication and online payment demonstration.</p>
        </header>

        <section className="card login-card">
          <div className="login-icon">🔐</div>

          <h2>Welcome</h2>
          <p>Sign in with your Google account to continue.</p>

          <button
            className="google-button"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </button>
        </section>
      </div>
    </main>
  );
}

// 2. Profile page
function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentStatusLoading, setPaymentStatusLoading] =
    useState(true);

  // Fetch authenticated user
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (response.status === 401) {
          window.location.href = "/";
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load profile.");
        }

        const data: { user: User } = await response.json();
        setUser(data.user);
      } catch {
        setError("Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Fetch payment status
  useEffect(() => {
    async function checkPaymentStatus() {
      try {
        const response = await fetch(
          `${API_URL}/api/payments/status`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Could not fetch payment status.");
        }

        const data: PaymentStatusResponse = await response.json();
        setIsPaid(data.paid);
      } catch (error) {
        console.error("Payment status error:", error);
      } finally {
        setPaymentStatusLoading(false);
      }
    }

    checkPaymentStatus();
  }, []);

  // Logout
  async function handleLogout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/";
    }
  }

  // Initiate Khalti payment
  async function handlePayment() {
    try {
      setPaymentLoading(true);
      setPaymentError("");

      const response = await fetch(
        `${API_URL}/api/payments/initiate`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data: { payment_url?: string; message?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Payment initiation failed."
        );
      }

      if (!data.payment_url) {
        throw new Error("Khalti did not return a payment URL.");
      }

      window.location.href = data.payment_url;
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setPaymentLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="app">
        <div className="container">
          <div className="card loading">
            Loading profile...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app">
        <div className="container">
          <div className="card error-message">{error}</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="app">
        <div className="container">
          <div className="card loading">
            No user information found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      <div className="container">
        <header className="page-header">
          <h1>My Dashboard</h1>
          <p>Manage your profile and product payment.</p>
        </header>

        {/* Profile card */}
        <section className="card">
          <div className="profile-header">
            {user.picture && (
              <img
                className="profile-avatar"
                src={user.picture}
                alt="Google profile"
              />
            )}

            <div className="profile-info">
              <h2>Welcome, {user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="divider" />

          <div className="action-row">
            <span>Signed in with Google</span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </section>

        {/* Product card */}
        <section className="card">
          <h2>Your Product</h2>
          <p>Sample product for Khalti payment testing.</p>

          <div className="product-card">
            <div className="product-top">
              <span className="product-name">
                Demo Product
              </span>

              {isPaid && !paymentStatusLoading && (
                <span className="status status-paid">
                  ✓ PAID
                </span>
              )}
            </div>

            <p className="product-price">NPR 100</p>

            {paymentStatusLoading ? (
              <p className="loading">
                Checking payment status...
              </p>
            ) : isPaid ? (
              <div className="payment-message payment-success">
                ✓ Your payment has been successfully verified.
              </div>
            ) : (
              <button
                className="primary-button"
                onClick={handlePayment}
                disabled={paymentLoading}
              >
                {paymentLoading
                  ? "Redirecting to Khalti..."
                  : "Pay NPR 100 with Khalti"}
              </button>
            )}

            {paymentError && (
              <div className="error-message" role="alert">
                {paymentError}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// 3. Payment result page
function PaymentResult() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");

  const messages: Record<string, string> = {
    success: "Payment verified successfully!",
    failed: "Payment was unsuccessful.",
    pending: "Payment is pending verification.",
  };

  const resultType =
    status === "success"
      ? "success"
      : status === "pending"
        ? "pending"
        : "failed";

  const resultIcon =
    resultType === "success"
      ? "✓"
      : resultType === "pending"
        ? "⌛"
        : "✕";

  return (
    <main className="app">
      <div className="container">
        <section className="card result-card">
          <div className={`result-icon ${resultType}`}>
            {resultIcon}
          </div>

          <h1>Payment Result</h1>

          <h2>
            {messages[status ?? ""] ?? "Unknown payment result."}
          </h2>

          <p>
            {status === "success"
              ? "Your transaction has been verified by Khalti."
              : "You can return to your profile to check your payment status."}
          </p>

          <button
            className="primary-button"
            onClick={() => {
              window.location.href = "/profile";
            }}
          >
            Go to Profile
          </button>
        </section>
      </div>
    </main>
  );
}

// 4. Main application
function App() {
  const currentPath = window.location.pathname;

  if (currentPath === "/profile") {
    return <Profile />;
  }

  if (currentPath === "/payment-result") {
    return <PaymentResult />;
  }

  return <Login />;
}

export default App;
