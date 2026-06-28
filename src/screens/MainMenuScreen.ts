import { Screen, Router } from "../app/Router";
import { Button } from "../ui/components/Button";
import { Card } from "../ui/components/Card";
import { SessionManager } from "../auth/SessionManager";
import { AuthService } from "../api/AuthService";

interface MenuOption {
  readonly label: string;
  readonly onClick: () => void;
}

export class MainMenuScreen implements Screen {
  private readonly router: Router;
  private readonly authService: AuthService;
  private root: HTMLElement | null = null;

  public constructor(router: Router) {
    this.router = router;
    this.authService = AuthService.getInstance();
  }

  public mount(container: HTMLElement): void {
    this.root = document.createElement("div");
    this.root.className = "screen screen--menu";

    const card = new Card();

    const title = document.createElement("h1");
    title.className = "menu__title";
    title.textContent = "BASKETBALL ATARI";
    card.append(title);

    const session = SessionManager.getInstance().getSession();
    const welcome = document.createElement("p");
    welcome.className = "menu__welcome";
    welcome.textContent = session !== null ? `> ${session.username}` : "";
    card.append(welcome);

    for (const option of this.buildOptions()) {
      const button = new Button({ label: option.label, variant: "primary", onClick: option.onClick });
      card.append(button.render());
    }

    this.root.appendChild(card.render());
    container.appendChild(this.root);
  }

  public unmount(): void {
    this.root?.remove();
    this.root = null;
  }

  private buildOptions(): ReadonlyArray<MenuOption> {
    return [
      { label: "Singleplayer", onClick: () => this.router.navigateTo("singleplayer") },
      { label: "Multiplayer", onClick: () => this.router.navigateTo("multiplayerLobby") },
      { label: "Options", onClick: () => console.log("[MainMenuScreen] Options clicado.") },
      { label: "Profile", onClick: () => console.log("[MainMenuScreen] Profile clicado.") },
      { label: "Logout", onClick: () => this.handleLogout() },
    ];
  }

  private handleLogout(): void {
    this.authService.logout();
    SessionManager.getInstance().clearSession();
    this.router.navigateTo("login");
  }
}