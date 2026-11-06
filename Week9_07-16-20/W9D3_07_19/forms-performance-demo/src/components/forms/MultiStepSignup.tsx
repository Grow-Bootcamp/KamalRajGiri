import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  signupSchema,
  type SignupFormValues,
} from "../../schemas/signupSchema";

export default function MultiStepSignup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    mode: "onTouched",
  });

  async function nextStep() {
    let isValid = false;

    if (currentStep === 0) {
      isValid = await trigger(["name", "email"]);
    } else if (currentStep === 1) {
      isValid = await trigger(["password", "confirmPassword"]);
    }

    if (isValid || currentStep === 2) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  }

  function previousStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  const onSubmit = async (data: SignupFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Final Multi-Step Payload Submitted:", data);
    setIsSuccess(true);
    reset();
  };

  const formData = getValues();

  return (
    <div className="form-container" style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Multi-Step Registration</h2>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", fontSize: "0.9rem", color: "#4b5563" }}>
        <span style={{ fontWeight: currentStep === 0 ? "bold" : "normal", color: currentStep === 0 ? "#2563eb" : "inherit" }}>
          1. Personal Info
        </span>
        <span style={{ fontWeight: currentStep === 1 ? "bold" : "normal", color: currentStep === 1 ? "#2563eb" : "inherit" }}>
          2. Security
        </span>
        <span style={{ fontWeight: currentStep === 2 ? "bold" : "normal", color: currentStep === 2 ? "#2563eb" : "inherit" }}>
          3. Review & Submit
        </span>
      </div>

      {isSuccess && (
        <div style={{ padding: "1rem", marginBottom: "1rem", background: "#d1fae5", color: "#065f46", borderRadius: "4px" }}>
          Registration successful! Form has been reset.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 0 && (
          <div>
            <h3>Personal Information</h3>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter your name"
                style={{ width: "100%", padding: "0.5rem", borderColor: errors.name ? '#dc2626' : '#d1d5db' }}
              />
              {errors.name && (
                <span style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                style={{ width: "100%", padding: "0.5rem", borderColor: errors.email ? '#dc2626' : '#d1d5db' }}
              />
              {errors.email && (
                <span style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h3>Account Security</h3>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                style={{ width: "100%", padding: "0.5rem", borderColor: errors.password ? '#dc2626' : '#d1d5db' }}
              />
              {errors.password && (
                <span style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm your password"
                style={{ width: "100%", padding: "0.5rem", borderColor: errors.confirmPassword ? '#dc2626' : '#d1d5db' }}
              />
              {errors.confirmPassword && (
                <span style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3>Review Your Information</h3>
            <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem" }}>
              <p><strong>Name:</strong> {formData.name || "N/A"}</p>
              <p><strong>Email:</strong> {formData.email || "N/A"}</p>
              <p><strong>Password:</strong> ********</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={previousStep}
              style={{ padding: "0.5rem 1rem", background: "#e5e7eb", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Back
            </button>
          )}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginLeft: "auto" }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: "0.5rem 1rem", background: isSubmitting ? "#93c5fd" : "#16a34a", color: "#fff", border: "none", borderRadius: "4px", cursor: isSubmitting ? "not-allowed" : "pointer", marginLeft: "auto" }}
            >
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}