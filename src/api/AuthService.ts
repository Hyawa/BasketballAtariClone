import { NakamaClient } from "./NakamaClient";
import { Session } from "../models/Session";
import { SessionManager } from "../auth/SessionManager";
import { AuthResult, LoginCredentials, RegisterCredentials } from "../types/Auth";

export class AuthService {
  private static instance: AuthService | null = null;
  private readonly nakamaClient: NakamaClient;

  private constructor() {
    this.nakamaClient = NakamaClient.getInstance();
  }

  public static getInstance(): AuthService {
    if (AuthService.instance === null) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * NOTA: o Nakama só valida senha através de authenticateEmail(email, password).
   * Por isso, o campo "username" do login precisa, por enquanto, conter o e-mail
   * cadastrado no registro. Ver nota no topo da resposta para evolução futura
   * (RPC server-side para resolver username -> email).
   */
  public async login(credentials: LoginCredentials): Promise<AuthResult<Session>> {
    console.log("[AuthService] Conectando ao servidor...");
    try {
      const nakamaSession = await this.nakamaClient
        .getClient()
        .authenticateEmail(credentials.username, credentials.password, false);

      const session = Session.fromNakamaSession(nakamaSession);
      console.log("[AuthService] Login realizado com sucesso.");
      return { success: true, data: session, errorMessage: null };
    } catch (error) {
      console.log("[AuthService] Falha no login.");
      return { success: false, data: null, errorMessage: this.extractErrorMessage(error) };
    }
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResult<Session>> {
    console.log("[AuthService] Registrando novo usuário...");
    try {
      const nakamaSession = await this.nakamaClient
        .getClient()
        .authenticateEmail(credentials.email, credentials.password, true, credentials.username);

      const session = Session.fromNakamaSession(nakamaSession);
      console.log("[AuthService] Registro realizado com sucesso.");
      return { success: true, data: session, errorMessage: null };
    } catch (error) {
      console.log("[AuthService] Falha no registro.");
      return { success: false, data: null, errorMessage: this.extractErrorMessage(error) };
    }
  }

  public restoreSession(): Session | null {
    const session = SessionManager.getInstance().getSession();
    if (session === null || session.isExpired()) {
      console.log("[AuthService] Nenhuma sessão válida para restaurar.");
      return null;
    }
    console.log("[AuthService] Sessão restaurada.");
    return session;
  }

  public logout(): void {
    console.log("[AuthService] Logout realizado.");
  }

  private extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }

  console.error("[AuthService] Erro não tratado:", error);
  return "Erro desconhecido ao comunicar com o servidor.";
}
}