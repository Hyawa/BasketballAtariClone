import { Session as NakamaSession } from "@heroiclabs/nakama-js";

export class Session {
  private constructor(private readonly nakamaSession: NakamaSession) {}

  public static fromNakamaSession(nakamaSession: NakamaSession): Session {
    return new Session(nakamaSession);
  }

  public get token(): string {
    return this.nakamaSession.token;
  }

  public get refreshToken(): string {
    return this.nakamaSession.refresh_token ?? "";
  }

  public get userId(): string {
    return this.nakamaSession.user_id ?? "";
  }

  public get username(): string {
    return this.nakamaSession.username ?? "";
  }

  public get expiresAt(): number {
    return this.nakamaSession.expires_at ?? 0;
  }

  public isExpired(): boolean {
    return this.nakamaSession.isexpired(Date.now() / 1000);
  }

  public getNakamaSession(): NakamaSession {
    return this.nakamaSession;
  }
}