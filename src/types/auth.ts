export interface User {
  id: string
  fullName: string
  email: string
  role: 'ROLE_USER' | 'ROLE_ADMIN'
  createdAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

/** Backend POST /auth/login + /auth/refresh payload (ApiResponse.data). Flat — no nested user object. */
export interface LoginResponseData {
  accessToken: string
  refreshToken: string
  issuedAt?: string
  expiresAt?: string
  fullName?: string
  email?: string
  userId?: string
  role?: string
}

/** Backend GET/PUT /user/profile payload (ApiResponse.data). */
export interface UserProfileResponseData {
  id: string
  fullName: string
  email: string
  role: string
  createdAt?: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface OtpSendRequest {
  email: string
}

export interface OtpSendResponseData {
  email: string
}

export interface OtpVerifyRequest {
  email: string
  otp: string
}

export interface OtpVerifyResponseData {
  email: string
  verified: boolean
}
