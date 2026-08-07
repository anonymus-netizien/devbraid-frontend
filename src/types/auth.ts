import type { Schema } from '../api/contract'

/** Frontend session/user model (derived from login response + profile). */
export interface User {
  id: string
  fullName: string
  email: string
  role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_DEVELOPER'
  createdAt?: string
}

/** Backend POST /auth/login request body. */
export type LoginRequest = Schema<'LoginRequest'>

/** Backend POST /auth/login + /auth/refresh payload (ApiResponse.data). Flat — no nested user object. */
export type LoginResponseData = Schema<'LoginResponse'>

/** Backend GET/PUT /user/profile payload (ApiResponse.data). */
export type UserProfileResponseData = Schema<'UserProfileResponse'>

/** Backend POST /auth/register request body. */
export type RegisterRequest = Schema<'RegisterRequest'>

/** Backend POST /auth/otp/send request body. */
export type OtpSendRequest = Schema<'OtpSendRequest'>

/** Backend POST /auth/otp/send payload (ApiResponse.data). */
export type OtpSendResponseData = Schema<'OtpSendResponse'>

/** Backend POST /auth/otp/verify request body. */
export type OtpVerifyRequest = Schema<'OtpVerifyRequest'>

/** Backend POST /auth/otp/verify payload (ApiResponse.data). */
export type OtpVerifyResponseData = Schema<'OtpVerifyResponse'>
