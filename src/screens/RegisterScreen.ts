import { Screen, Router } from "../app/Router";
import { Button } from "../ui/components/Button";
import { Input } from "../ui/components/Input";
import { Card } from "../ui/components/Card";
import { AuthService } from "../api/AuthService";
import { Validators } from "../utils/Validators";
import { ValidationResult } from "../types/Auth";

export class RegisterScreen implements Screen {
  private readonly router: Router;
  private readonly authService: AuthService;
  private root: HTMLElement | null = null;

  private usernameInput: Input | null = null;
  private emailInput: Input | null = null;
  private passwordInput: Input | null = null;
  private confirmPasswordInput: Input | null = null;
  private registerButton: Button | null = null;
  private errorElement: HTMLParagraphElement | null = null;
  private loadingElement: HTMLParagraphElement | null = null;

  public constructor(router: Router) {
    this.router = router;
    this.authService = AuthService.getInstance();
  }

  public mount(container: HTMLElement): void {
    this.root = document.createElement("div");
    this.root.className = "screen screen--register";

    const card = new Card();

    const title = document.createElement("h1");
    title.className = "register__title";
    title.textContent = "REGISTER";
    card.append(title);

    this.usernameInput = new Input({ label: "Username", type: "text", placeholder: "Escolha um username" });
    this.emailInput = new Input({ label: "Email", type: "email", placeholder: "seu@email.com" });
    this.passwordInput = new Input({ label: "Password", type: "password", placeholder: "Crie uma senha" });
    this.confirmPasswordInput = new Input({
      label: "Confirm Password",
      type: "password",
      placeholder: "Repita a senha",
    });

    card.append(this.usernameInput.render());
    card.append(this.emailInput.render());
    card.append(this.passwordInput.render());
    card.append(this.confirmPasswordInput.render());

    this.errorElement = document.createElement("p");
    this.errorElement.className = "form-error";
    card.append(this.errorElement);

    this.loadingElement = document.createElement("p");
    this.loadingElement.className = "form-loading";
    card.append(this.loadingElement);

    this.registerButton = new Button({
      label: "Register",
      variant: "primary",
      onClick: () => void this.handleRegister(),
    });
    card.append(this.registerButton.render());

    const backButton = new Button({
      label: "Back",
      variant: "secondary",
      onClick: () => this.router.navigateTo("login"),
    });
    card.append(backButton.render());

    this.root.appendChild(card.render());
    container.appendChild(this.root);
  }

  public unmount(): void {
    this.root?.remove();
    this.root = null;
  }

  private async handleRegister(): Promise<void> {
    const username = this.usernameInput?.getValue().trim() ?? "";
    const email = this.emailInput?.getValue().trim() ?? "";
    const password = this.passwordInput?.getValue() ?? "";
    const confirmPassword = this.confirmPasswordInput?.getValue() ?? "";

    const validation = this.validateForm(username, email, password, confirmPassword);
    if (!validation.isValid) {
      this.showError(validation.errorMessage ?? "Dados inválidos.");
      return;
    }

    this.clearError();
    this.setLoading(true);

    const result = await this.authService.register({ username, email, password, confirmPassword });

    this.setLoading(false);

    if (!result.success) {
      this.showError(result.errorMessage ?? "Falha ao registrar.");
      return;
    }

    console.log("[RegisterScreen] Registro concluído. Retornando para login.");
    this.router.navigateTo("login");
  }

  private validateForm(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): ValidationResult {
    const usernameValidation = Validators.validateUsername(username);
    if (!usernameValidation.isValid) {
      return usernameValidation;
    }

    const emailValidation = Validators.validateEmail(email);
    if (!emailValidation.isValid) {
      return emailValidation;
    }

    const passwordValidation = Validators.validatePassword(password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }

    return Validators.validatePasswordConfirmation(password, confirmPassword);
  }

  private showError(message: string): void {
    if (this.errorElement !== null) {
      this.errorElement.textContent = message;
    }
  }

  private clearError(): void {
    this.showError("");
  }

  private setLoading(isLoading: boolean): void {
    if (this.loadingElement !== null) {
      this.loadingElement.textContent = isLoading ? "Carregando..." : "";
    }
    this.registerButton?.setDisabled(isLoading);
  }
}