
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type User = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

// 1. Login page
function Login() {
  function handleGoogleLogin() {
    window.location.href = `${API_URL}/api/auth/google`;
  }

  return (
    <main>
      <h1>Google Khalti Demo</h1>
      <p>Sign in to continue.</p>

      <button onClick={handleGoogleLogin}>
        Continue with Google
      </button>
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
const [paymentStatusLoading, setPaymentStatusLoading] = useState(true);

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


  useEffect(() => {
  const checkPaymentStatus = async () => {
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

      const data = await response.json();

      setIsPaid(data.paid);
    } catch (error) {
      console.error("Payment status error:", error);
    } finally {
      setPaymentStatusLoading(false);
    }
  };

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

      // Redirect to Khalti checkout
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
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>No user information found.</p>;
  }

  return (
    <main>
      <h1>Welcome, {user.name}</h1>

      {user.picture && (
        <img
          src={user.picture}
          alt="Google profile"
          width={100}
        />
      )}

      <p>Email: {user.email}</p>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <section>
        <h2>Demo Product</h2>
        <p>Sample product for Khalti payment testing.</p>
        <p>Price: NPR 100</p>

{paymentStatusLoading ? (
    <p>Checking payment status...</p>
  ) : isPaid ? (
    <div>
      <h3>Payment Status: Paid</h3>
      <p>Your payment has been successfully verified.</p>
    </div>
  ) : (
    <button
      onClick={handlePayment}
      disabled={paymentLoading}
    >
      {paymentLoading
        ? "Redirecting to Khalti..."
        : "Pay NPR 100 with Khalti"}
    </button>
  )}

        {paymentError && (
          <p role="alert">{paymentError}</p>
        )}
      </section>
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

  return (
    <main>
      <h1>Payment Result</h1>

      <h2>
        {messages[status ?? ""] ?? "Unknown payment result."}
      </h2>

      <button
        onClick={() => {
          window.location.href = "/profile";
        }}
      >
        Return to Profile
      </button>
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
