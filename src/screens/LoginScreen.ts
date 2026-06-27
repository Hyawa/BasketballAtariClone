import { Screen, Router } from "../app/Router";
import { Button } from "../ui/components/Button";
import { Input } from "../ui/components/Input";
import { Card } from "../ui/components/Card";
import { AuthService } from "../api/AuthService";
import { SessionManager } from "../auth/SessionManager";
import { Validators } from "../utils/Validators";

export class LoginScreen implements Screen {
  private readonly router: Router;
  private readonly authService: AuthService;
  private root: HTMLElement | null = null;

  private usernameInput: Input | null = null;
  private passwordInput: Input | null = null;
  private loginButton: Button | null = null;
  private errorElement: HTMLParagraphElement | null = null;
  private loadingElement: HTMLParagraphElement | null = null;

  public constructor(router: Router) {
    this.router = router;
    this.authService = AuthService.getInstance();
  }

  public mount(container: HTMLElement): void {
    this.root = document.createElement("div");
    this.root.className = "screen screen--login";

    const card = new Card();

    const logo = document.createElement("h1");
    logo.className = "login__logo";
    logo.textContent = "BASKETBALL ATARI";
    card.append(logo);

    this.usernameInput = new Input({ label: "Username", type: "text", placeholder: "Digite seu username" });
    this.passwordInput = new Input({ label: "Password", type: "password", placeholder: "Digite sua senha" });

    card.append(this.usernameInput.render());
    card.append(this.passwordInput.render());

    this.errorElement = document.createElement("p");
    this.errorElement.className = "form-error";
    card.append(this.errorElement);

    this.loadingElement = document.createElement("p");
    this.loadingElement.className = "form-loading";
    card.append(this.loadingElement);

    this.loginButton = new Button({
      label: "Login",
      variant: "primary",
      onClick: () => void this.handleLogin(),
    });
    card.append(this.loginButton.render());

    const registerButton = new Button({
      label: "Register",
      variant: "secondary",
      onClick: () => this.router.navigateTo("register"),
    });
    card.append(registerButton.render());

    this.root.appendChild(card.render());
    container.appendChild(this.root);
  }

  public unmount(): void {
    this.root?.remove();
    this.root = null;
  }

  private async handleLogin(): Promise<void> {
    const username = this.usernameInput?.getValue().trim() ?? "";
    const password = this.passwordInput?.getValue() ?? "";

    const usernameValidation = Validators.validateUsername(username);
    if (!usernameValidation.isValid) {
      this.showError(usernameValidation.errorMessage ?? "Username inválido.");
      return;
    }

    const passwordValidation = Validators.validatePassword(password);
    if (!passwordValidation.isValid) {
      this.showError(passwordValidation.errorMessage ?? "Password inválido.");
      return;
    }

    this.clearError();
    this.setLoading(true);

    const result = await this.authService.login({ username, password });

    this.setLoading(false);

    if (!result.success || result.data === null) {
      this.showError(result.errorMessage ?? "Falha ao realizar login.");
      return;
    }

    SessionManager.getInstance().setSession(result.data);
    this.router.navigateTo("menu");
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
    this.loginButton?.setDisabled(isLoading);
  }
}