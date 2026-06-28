import { Router } from "./Router";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { MainMenuScreen } from "../screens/MainMenuScreen";
import { SinglePlayerScene } from "../scenes/SinglePlayerScene";
import { AuthService } from "../api/AuthService";
import { MultiplayerLobbyScene } from "../scenes/MultiplayerLobbyScene";


export class App {
  private readonly router: Router;
  private readonly authService: AuthService;

  public constructor(rootElement: HTMLElement) {
    console.log("[App] Inicializando aplicação...");
    this.router = new Router(rootElement);
    this.authService = AuthService.getInstance();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.register("login", () => new LoginScreen(this.router), false);
    this.router.register("register", () => new RegisterScreen(this.router), false);
    this.router.register("menu", () => new MainMenuScreen(this.router), true);
    this.router.register("singleplayer", () => new SinglePlayerScene(this.router), true);
    this.router.register("multiplayerLobby", () => new MultiplayerLobbyScene(this.router), true);
  }

  public start(): void {
    console.log("[App] Aplicação iniciada.");

    const restoredSession = this.authService.restoreSession();
    if (restoredSession !== null) {
      this.router.navigateTo("menu");
      return;
    }

    this.router.navigateTo("login");
  }
}