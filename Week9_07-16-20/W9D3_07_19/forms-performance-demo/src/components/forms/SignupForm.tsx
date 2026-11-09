
import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";

import type {
    SignupValues,
    SignupField,
    SignupErrors,
} from "../../types/signup";

import { validateSignup } from "../../utils/validatesSignup";

export default function SignupForm() {
    const [values, setValues] = useState<SignupValues>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<SignupErrors>({});

    const [touched, setTouched] = useState<Record<SignupField, boolean>>({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] =
        useState(false);

    // Ensure that the input name belongs to SignupField.
    function isSignupField(name: string): name is SignupField {
        return [
            "name",
            "email",
            "password",
            "confirmPassword",
        ].includes(name);
    }

    // Update form values and revalidate touched fields.
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        if (!isSignupField(name)) return;

        const updatedValues = {
            ...values,
            [name]: value,
        };

        setValues(updatedValues);
        setIsSubmittedSuccessfully(false);

        if (touched[name]) {
            setErrors(validateSignup(updatedValues));
        }
    }

    // Mark the current field as touched.
    function handleBlur(event: FocusEvent<HTMLInputElement>) {
        const { name } = event.target;

        if (!isSignupField(name)) return;

        setTouched((previous) => ({
            ...previous,
            [name]: true,
        }));

        setErrors(validateSignup(values));
    }

    // Validate the entire form before submission.
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        const validationErrors = validateSignup(values);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmittedSuccessfully(true);
            // In a real application, submit the values to the backend here.
        } else {
            setIsSubmittedSuccessfully(false);
        }
    }

    return (
        <div
            className="form-container"
            style={{
                padding: "2rem",
                maxWidth: "450px",
                margin: "0 auto",
            }}
        >
            <h2>Signup Form</h2>

            {isSubmittedSuccessfully && (
                <div
                    role="status"
                    style={{
                        padding: "1rem",
                        marginBottom: "1rem",
                        background: "#d1fae5",
                        color: "#065f46",
                        borderRadius: "4px",
                    }}
                >
                    Registration successful!
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                {/* Name Field */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your name"
                        aria-invalid={Boolean(touched.name && errors.name)}
                        aria-describedby={
                            touched.name && errors.name ? "name-error" : undefined
                        }
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderColor:
                                touched.name && errors.name ? "#dc2626" : "#d1d5db",
                        }}
                    />
                    {touched.name && errors.name && (
                        <span
                            id="name-error"
                            style={{ color: "#dc2626", fontSize: "0.85rem" }}
                        >
                            {errors.name}
                        </span>
                    )}
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        aria-invalid={Boolean(touched.email && errors.email)}
                        aria-describedby={
                            touched.email && errors.email
                                ? "email-error"
                                : undefined
                        }
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderColor:
                                touched.email && errors.email ? "#dc2626" : "#d1d5db",
                        }}
                    />
                    {touched.email && errors.email && (
                        <span
                            id="email-error"
                            style={{ color: "#dc2626", fontSize: "0.85rem" }}
                        >
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your password"
                        aria-invalid={Boolean(touched.password && errors.password)}
                        aria-describedby={
                            touched.password && errors.password
                                ? "password-error"
                                : undefined
                        }
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderColor:
                                touched.password && errors.password
                                    ? "#dc2626"
                                    : "#d1d5db",
                        }}
                    />
                    {touched.password && errors.password && (
                        <span
                            id="password-error"
                            style={{ color: "#dc2626", fontSize: "0.85rem" }}
                        >
                            {errors.password}
                        </span>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div style={{ marginBottom: "1.25rem" }}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm your password"
                        aria-invalid={Boolean(
                            touched.confirmPassword && errors.confirmPassword
                        )}
                        aria-describedby={
                            touched.confirmPassword && errors.confirmPassword
                                ? "confirmPassword-error"
                                : undefined
                        }
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderColor:
                                touched.confirmPassword && errors.confirmPassword
                                    ? "#dc2626"
                                    : "#d1d5db",
                        }}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                        <span
                            id="confirmPassword-error"
                            style={{ color: "#dc2626", fontSize: "0.85rem" }}
                        >
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Submit Registration
                </button>
            </form>

            <h3 style={{ marginTop: "1.5rem" }}>
                Live Form State Monitor
            </h3>

            <pre
                style={{
                    background: "#f4f4f4",
                    padding: "1rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    overflowX: "auto",
                }}
            >
                {JSON.stringify({ values, touched, errors }, null, 2)}
            </pre>
        </div>
    );
}
