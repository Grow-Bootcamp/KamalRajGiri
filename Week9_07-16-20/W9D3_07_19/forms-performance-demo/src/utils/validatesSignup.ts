import type { SignupValues, SignupErrors }  from "../types/signup"

export function validateSignup(values: SignupValues): SignupErrors {
    const errors: SignupErrors = {};

    // Name validation
    if (!values.name.trim()) {
        errors.name = "Name is required";
    } else if (values.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!values.email.trim()) {
        errors.email = "Email is required";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(values.email)) {
            errors.email = "Please enter a valid email";
        }
    }

    // Password validation
    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    } else if (!/\d/.test(values.password)) {
        errors.password = "Password must contain at least one number";
    }

    // Confirm password validation
    if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}