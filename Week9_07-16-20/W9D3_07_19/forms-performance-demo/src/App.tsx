import { lazy, Suspense, useState } from "react";

import Forms from "./pages/Forms";
import MultiStepForms from "./pages/MultiStepForm";
import PerformanceDemo from "./components/performance/PerformanceDemo";
import Parent from "./pages/TestDemo";

import "./App.css";

// Lazy-loaded page
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <main className="app">
      <header className="app-header">
        <h1>React Forms & Performance Demo</h1>
        <p>
          Exploring form validation, multi-step forms,
          React rendering optimization, and code splitting.
        </p>
      </header>

      {/* Form demonstrations */}
      <section className="app-section">
        <h2>1. Form Validation</h2>
        <Forms />
      </section>

      <section className="app-section">
        <h2>2. Multi-Step Registration</h2>
        <MultiStepForms />
      </section>

      {/* Rendering optimization demonstrations */}
      <section className="app-section">
        <h2>3. Component Rendering & Optimization</h2>
        <Parent />
        <PerformanceDemo />
      </section>

      {/* Lazy-loaded Analytics */}
      <section className="app-section">
        <h2>4. Lazy Loading & Code Splitting</h2>

        <button
          type="button"
          onClick={() => setShowAnalytics((previous) => !previous)}
        >
          {showAnalytics ? "Hide Analytics" : "Show Analytics"}
        </button>

        {showAnalytics && (
          <Suspense fallback={<p>Loading analytics dashboard...</p>}>
            <Analytics />
          </Suspense>
        )}
      </section>
    </main>
  );
}

export default App;