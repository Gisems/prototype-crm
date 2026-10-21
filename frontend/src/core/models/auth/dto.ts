import type { PasswordFormValues, SignInFormValues } from "./form"

export interface SignInDto {
  email: string
  password: string
  rememberMe: boolean
}

export function toSignInDto({ email, password }: SignInFormValues, rememberMe: boolean): SignInDto {
  return { email, password, rememberMe }
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

export function toChangePasswordDto({ currentPassword, newPassword }: PasswordFormValues): ChangePasswordDto {
  return { currentPassword, newPassword }
}
