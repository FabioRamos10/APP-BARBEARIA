import { apiFetch } from "@/lib/api/client";
import type {
  ForgotPasswordRequestDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
  ResetPasswordRequestDTO,
} from "@/lib/types/api";

export function login(dto: LoginRequestDTO) {
  return apiFetch<LoginResponseDTO>("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(dto),
  });
}

export function register(dto: RegisterRequestDTO) {
  return apiFetch<void>("/auth/register", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(dto),
  });
}

export function forgotPassword(dto: ForgotPasswordRequestDTO) {
  return apiFetch<void>("/auth/forgot-password", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(dto),
  });
}

export function resetPassword(dto: ResetPasswordRequestDTO) {
  return apiFetch<void>("/auth/reset-password", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(dto),
  });
}
