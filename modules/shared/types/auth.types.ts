export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    email: string;
    fullName: string;
    role: string;
    expiresAt: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface User {
  email: string;
  fullName: string;
  role: string;
  expiresAt?: string;
}
