import { Session } from "../models/Session";

export class SessionManager {
  private static instance: SessionManager | null = null;
  private currentSession: Session | null = null;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (SessionManager.instance === null) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public setSession(session: Session): void {
    this.currentSession = session;
    console.log("[SessionManager] Sessão criada.");
  }

  public getSession(): Session | null {
    return this.currentSession;
  }

  public isAuthenticated(): boolean {
    if (this.currentSession === null) {
      return false;
    }
    if (this.currentSession.isExpired()) {
      console.log("[SessionManager] Sessão expirada.");
      return false;
    }
    return true;
  }

  public clearSession(): void {
    this.currentSession = null;
    console.log("[SessionManager] Sessão encerrada.");
  }
}