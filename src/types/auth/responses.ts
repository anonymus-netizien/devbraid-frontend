// Backend ApiResponse<T> wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Matches backend LoginResponse exactly
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  issuedAt: string;
  expiresAt: string;
  fullName: string;
  email: string;
  userId: string;
  role: string;
}

// Register returns ApiResponse<Void> — no data
export type RegisterResponseData = null;

// Matches backend UserProfileResponse exactly
export interface UserProfileResponseData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

// OTP responses
export interface OtpSendResponseData {
  email: string;
}

export interface OtpVerifyResponseData {
  email: string;
  verified: boolean;
}
