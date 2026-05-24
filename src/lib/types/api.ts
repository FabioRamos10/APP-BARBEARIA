export interface ApiErrorBody {
  message: string;
  status: number;
  error?: string;
  errors?: Record<string, string>;
}

export interface LoginResponseDTO {
  token: string;
}

/** Cadastro público — somente CLIENTE */
export interface RegisterRequestDTO {
  nome: string;
  email: string;
  senha: string;
  role: "CLIENTE";
  telefone?: string;
}

export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  novaSenha: string;
}
