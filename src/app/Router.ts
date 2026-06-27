import { AuthGuard } from "../auth/AuthGuard";

export interface Screen {
  mount(container: HTMLElement): void;
  unmount(): void;
}

export type ScreenName = "login" | "register" | "menu" | "singleplayer";

interface RouteDefinition {
  readonly factory: () => Screen;
  readonly requiresAuth: boolean;
}

export class Router {
  private readonly container: HTMLElement;
  private readonly routes: Map<ScreenName, RouteDefinition> = new Map();
  private currentScreen: Screen | null = null;

  public constructor(container: HTMLElement) {
    this.container = container;
  }

  public register(name: ScreenName, factory: () => Screen, requiresAuth: boolean): void {
    this.routes.set(name, { factory, requiresAuth });
  }

  public navigateTo(name: ScreenName): void {
    const route = this.routes.get(name);
    if (route === undefined) {
      console.log(`[Router] Rota não encontrada: ${name}`);
      return;
    }

    if (route.requiresAuth && !AuthGuard.canAccessProtectedScreen()) {
      console.log(`[Router] Acesso negado a "${name}". Redirecionando para login.`);
      this.navigateTo("login");
      return;
    }

    console.log(`[Router] Mudança de tela para: ${name}`);
    this.unmountCurrentScreen();

    const screen = route.factory();
    this.container.innerHTML = "";
    screen.mount(this.container);
    this.currentScreen = screen;
  }

  private unmountCurrentScreen(): void {
    if (this.currentScreen !== null) {
      this.currentScreen.unmount();
      this.currentScreen = null;
    }
  }
}