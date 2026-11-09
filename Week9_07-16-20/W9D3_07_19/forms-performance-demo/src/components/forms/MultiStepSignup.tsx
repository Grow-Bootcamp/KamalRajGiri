
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  signupSchema,
  type SignupFormValues,
} from "../../schemas/signupSchema";

export default function MultiStepSignup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const allowFinalSubmit = useRef(false);

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
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Automatically hide the success message after 3 seconds.
  useEffect(() => {
    if (!isSuccess) return;

    const timeoutId = window.setTimeout(() => {
      setIsSuccess(false);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isSuccess]);

  // Validate the current step before proceeding.
  async function nextStep() {
    if (isAdvancing || isSubmitting || currentStep >= 2) {
      return;
    }

    setIsSuccess(false);
    setIsAdvancing(true);

    try {
      let isValid = false;

      if (currentStep === 0) {
        isValid = await trigger(["name", "email"], {
          shouldFocus: true,
        });
      } else if (currentStep === 1) {
        isValid = await trigger(
          ["password", "confirmPassword"],
          { shouldFocus: true }
        );
      }

      if (isValid) {
        setCurrentStep((previous) => Math.min(previous + 1, 2));
      }
    } finally {
      setIsAdvancing(false);
    }
  }

  // Navigate backward without losing entered values.
  function previousStep() {
    if (isSubmitting || isAdvancing) {
      return;
    }

    setIsSuccess(false);
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  // Called only after the final form submission is authorized
  // and React Hook Form successfully validates the complete form.
  async function onSubmit(data: SignupFormValues) {
    if (currentStep !== 2) {
      return;
    }

    // Simulate an asynchronous registration request.
    // Replace this with your actual API request when integrating the backend.
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1000);
    });

    console.info("[Signup Wizard] Registration completed.", {
      name: data.name,
      email: data.email,
    });

    reset();
    setCurrentStep(0);
    setIsSuccess(true);
  }

  // Called when full-form Yup validation fails.
  function onInvalid(submissionErrors: typeof errors) {
    console.warn("[Signup Wizard] Validation failed.", {
      invalidFields: Object.keys(submissionErrors),
    });
  }

  const formData = getValues();

  return (
    <div
      className="form-container"
      style={{
        padding: "2rem",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h2>Multi-Step Registration</h2>

      {/* Step indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          fontSize: "0.9rem",
          color: "#4b5563",
        }}
      >
        <span
          style={{
            fontWeight: currentStep === 0 ? "bold" : "normal",
            color: currentStep === 0 ? "#2563eb" : "inherit",
          }}
        >
          1. Personal Info
        </span>

        <span
          style={{
            fontWeight: currentStep === 1 ? "bold" : "normal",
            color: currentStep === 1 ? "#2563eb" : "inherit",
          }}
        >
          2. Security
        </span>

        <span
          style={{
            fontWeight: currentStep === 2 ? "bold" : "normal",
            color: currentStep === 2 ? "#2563eb" : "inherit",
          }}
        >
          3. Review & Submit
        </span>
      </div>

      {/* Success message */}
      {isSuccess && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "#d1fae5",
            color: "#065f46",
            borderRadius: "4px",
          }}
        >
          Registration successful! Form has been reset.
        </div>
      )}

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          // Reject unexpected or unauthorized form submissions.
          if (!allowFinalSubmit.current || currentStep !== 2) {
            allowFinalSubmit.current = false;
            return;
          }

          // Consume the permission before starting submission.
          allowFinalSubmit.current = false;

          await handleSubmit(onSubmit, onInvalid)(event);
        }}
        onKeyDown={(event) => {
          // Enter advances Steps 1 and 2 instead of submitting.
          if (
            event.key === "Enter" &&
            event.target instanceof HTMLInputElement &&
            currentStep < 2
          ) {
            event.preventDefault();
            void nextStep();
          }
        }}
        noValidate
      >
        {/* STEP 1: Personal Information */}
        {currentStep === 0 && (
          <div>
            <h3>Personal Information</h3>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="wizard-name"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Name
              </label>

              <input
                id="wizard-name"
                type="text"
                {...register("name")}
                placeholder="Enter your name"
                aria-invalid={!!errors.name}
                aria-describedby={
                  errors.name ? "wizard-name-error" : undefined
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderColor: errors.name ? "#dc2626" : "#d1d5db",
                }}
              />

              {errors.name && (
                <span
                  id="wizard-name-error"
                  style={{
                    color: "#dc2626",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                    display: "block",
                  }}
                >
                  {errors.name.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="wizard-email"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Email
              </label>

              <input
                id="wizard-email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "wizard-email-error" : undefined
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderColor: errors.email ? "#dc2626" : "#d1d5db",
                }}
              />

              {errors.email && (
                <span
                  id="wizard-email-error"
                  style={{
                    color: "#dc2626",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                    display: "block",
                  }}
                >
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Account Security */}
        {currentStep === 1 && (
          <div>
            <h3>Account Security</h3>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="wizard-password"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>

              <input
                id="wizard-password"
                type="password"
                {...register("password", {
                  deps: ["confirmPassword"],
                })}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "wizard-password-error" : undefined
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderColor: errors.password ? "#dc2626" : "#d1d5db",
                }}
              />

              {errors.password && (
                <span
                  id="wizard-password-error"
                  style={{
                    color: "#dc2626",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                    display: "block",
                  }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="wizard-confirm-password"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Confirm Password
              </label>

              <input
                id="wizard-confirm-password"
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm your password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "wizard-confirm-password-error"
                    : undefined
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderColor: errors.confirmPassword
                    ? "#dc2626"
                    : "#d1d5db",
                }}
              />

              {errors.confirmPassword && (
                <span
                  id="wizard-confirm-password-error"
                  style={{
                    color: "#dc2626",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                    display: "block",
                  }}
                >
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Review & Submit */}
        {currentStep === 2 && (
          <div>
            <h3>Review Your Information</h3>

            <div
              style={{
                background: "#f9fafb",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "1.5rem",
              }}
            >
              <p>
                <strong>Name:</strong> {formData.name || "N/A"}
              </p>

              <p>
                <strong>Email:</strong> {formData.email || "N/A"}
              </p>

              <p>
                <strong>Password:</strong> Hidden for security
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {currentStep > 0 && (
            <button
              type="button"
              onClick={previousStep}
              disabled={isSubmitting || isAdvancing}
              style={{
                padding: "0.5rem 1rem",
                background: "#e5e7eb",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          )}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={() => void nextStep()}
              disabled={isAdvancing || isSubmitting}
              style={{
                padding: "0.5rem 1rem",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: isAdvancing ? "not-allowed" : "pointer",
                opacity: isAdvancing ? 0.7 : 1,
                marginLeft: "auto",
              }}
            >
              {isAdvancing ? "Validating..." : "Next"}
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => {
                allowFinalSubmit.current = true;
              }}
              disabled={isSubmitting || isAdvancing}
              style={{
                padding: "0.5rem 1rem",
                background: isSubmitting ? "#93c5fd" : "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                marginLeft: "auto",
              }}
            >
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
