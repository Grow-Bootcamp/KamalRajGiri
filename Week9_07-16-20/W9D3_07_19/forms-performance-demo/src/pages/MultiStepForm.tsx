
import MultiStepSignup from "../components/forms/MultiStepSignup";

function MultiStepForms() {
  return (
    <section className="app">
      <header className="app-header">
        <h1>Multi Step Form Demo</h1>
      </header>

      <section className="form-card">
        <MultiStepSignup />
      </section>

    </section>
  );
}

export default MultiStepForms;