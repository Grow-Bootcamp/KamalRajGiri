import * as yup from "yup";

export const signupSchema = yup.object({
    name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2,"Name must be at least 2 character"),
    email: yup.string().trim()
    .required("Email is required")
    .email("Please enter a valid email"),
    password:yup.string()
    .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/\d/, "Password must contain at least one number"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords do not match"),
}).required();

export type SignupFormValues = yup.InferType<typeof signupSchema>;