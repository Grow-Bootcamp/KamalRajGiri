export interface  LoginCredentials {
    email: string;
    password : string;
}

export interface LoginResponse{
    token: string;
}

export interface ProfileResponse{
    message: string;
    user:{
    userId: string;
    role: 'user'| 'admin';}
}