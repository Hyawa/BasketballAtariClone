import { SessionManager } from "./SessionManager";

export class AuthGuard {
  private constructor() {}

  public static canAccessProtectedScreen(): boolean {
    return SessionManager.getInstance().isAuthenticated();
  }
}