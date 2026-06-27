export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

export interface RegisterCredentials {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errorMessage: string | null;
}

export interface AuthResult<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly errorMessage: string | null;
}