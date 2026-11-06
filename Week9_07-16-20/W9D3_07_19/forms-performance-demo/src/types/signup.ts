export interface SignupValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignupErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export type SignupField = keyof SignupValues;