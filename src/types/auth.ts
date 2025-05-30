export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
}

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  registered_at: string;
}

export type AuthToken = string | null;
