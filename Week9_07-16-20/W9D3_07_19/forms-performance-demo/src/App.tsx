import SignupForm from "./components/forms/SignupForm";
import HookFormSignup from "./components/forms/HookFormSignup";
import './App.css'

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>Registration Form Demo</h1>
        <p>
          Comparing handwritten validation with React Hook Form and Yup.
        </p>
      </header>

      <section className="forms-grid">
        <div className="form-card">
          <SignupForm />
        </div>

        <div className="form-card">
          <HookFormSignup />
        </div>
      </section>
    </main>
  );
}

export default App;