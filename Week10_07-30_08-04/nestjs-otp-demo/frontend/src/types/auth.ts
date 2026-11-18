
export interface RegisterInput {
  fullName: string,
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    fullName: string,
    email: string;
    createdAt: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
  challenge: {
    challengeId: string;
    expiresAt: string;
  };
}


export interface VerifyOtpInput {
  challengeId: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  verified: boolean;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
}
