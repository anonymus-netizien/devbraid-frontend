export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string; // Used if we don't rely entirely on HttpOnly cookies
}
