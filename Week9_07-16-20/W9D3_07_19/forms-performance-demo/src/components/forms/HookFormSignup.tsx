
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    signupSchema,
    type SignupFormValues,
} from "../../schemas/signupSchema";

export default function HookFormSignup() {
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: yupResolver(signupSchema),
    });

    const onSubmit = async () => {
        setIsSuccess(false);

        // Simulate an asynchronous API request.
        await new Promise((resolve) => setTimeout(resolve, 1200));

        setIsSuccess(true);
        reset();
    };

    return (
        <div
            className="form-container"
            style={{
                padding: "2rem",
                maxWidth: "450px",
                margin: "0 auto",
            }}
        >
            <h2>React Hook Form + Yup Signup</h2>

            {isSuccess && (
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
                    Registration successful! Form has been reset.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Name Field */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="Enter your name"
                        aria-invalid={Boolean(errors.name)}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderColor: errors.name ? "#dc2626" : "#d1d5db",
                        }}
                    />
                    {errors.name && (
                        <span style={{ color: "#dc2626", fontSize: "0.85rem" }}>
                            {errors.name.message}
                        </span>
                    )}
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email"
                        aria-invalid={Boolean(errors.email)}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderColor: errors.email ? "#dc2626" : "#d1d5db",
                        }}
                    />
                    {errors.email && (
                        <span style={{ color: "#dc2626", fontSize: "0.85rem" }}>
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="Enter your password"
                        aria-invalid={Boolean(errors.password)}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderColor: errors.password ? "#dc2626" : "#d1d5db",
                        }}
                    />
                    {errors.password && (
                        <span style={{ color: "#dc2626", fontSize: "0.85rem" }}>
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div style={{ marginBottom: "1.25rem" }}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Confirm your password"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderColor: errors.confirmPassword
                                ? "#dc2626"
                                : "#d1d5db",
                        }}
                    />
                    {errors.confirmPassword && (
                        <span style={{ color: "#dc2626", fontSize: "0.85rem" }}>
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: isSubmitting ? "#93c5fd" : "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                    }}
                >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
            </form>
        </div>
    );
}
