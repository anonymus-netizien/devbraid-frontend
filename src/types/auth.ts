export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: 'ROLE_USER' | 'ROLE_ADMIN'
  emailVerified: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface OtpVerifyRequest {
  email: string
  otp: string
}
