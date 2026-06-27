import { ValidationResult } from "../types/Auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;

export class Validators {
  public static validateUsername(username: string): ValidationResult {
    const trimmed = username.trim();
    if (trimmed.length === 0) {
      return { isValid: false, errorMessage: "Username é obrigatório." };
    }
    if (trimmed.length < MIN_USERNAME_LENGTH) {
      return {
        isValid: false,
        errorMessage: `Username deve ter no mínimo ${MIN_USERNAME_LENGTH} caracteres.`,
      };
    }
    return { isValid: true, errorMessage: null };
  }

  public static validateEmail(email: string): ValidationResult {
    const trimmed = email.trim();
    if (trimmed.length === 0) {
      return { isValid: false, errorMessage: "Email é obrigatório." };
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return { isValid: false, errorMessage: "Email inválido." };
    }
    return { isValid: true, errorMessage: null };
  }

  public static validatePassword(password: string): ValidationResult {
    if (password.length === 0) {
      return { isValid: false, errorMessage: "Password é obrigatório." };
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return {
        isValid: false,
        errorMessage: `Password deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`,
      };
    }
    return { isValid: true, errorMessage: null };
  }

  public static validatePasswordConfirmation(
    password: string,
    confirmPassword: string,
  ): ValidationResult {
    if (password !== confirmPassword) {
      return { isValid: false, errorMessage: "As senhas não coincidem." };
    }
    return { isValid: true, errorMessage: null };
  }
}