import { Socket, MatchmakerMatched, Session as NakamaSession } from "@heroiclabs/nakama-js";
import { NakamaClient } from "./NakamaClient";
import { SessionManager } from "../auth/SessionManager";

export class MatchmakingService {
  private static instance: MatchmakingService | null = null;
  private socket: Socket | null = null;
  private currentTicket: string | null = null;

  private constructor() {}

  public static getInstance(): MatchmakingService {
    if (MatchmakingService.instance === null) {
      MatchmakingService.instance = new MatchmakingService();
    }
    return MatchmakingService.instance;
  }

  /**
   * Inicializa e conecta o Web Socket caso ainda não esteja ativo.
   */
  private async ensureSocketConnected(): Promise<Socket> {
    if (this.socket && this.socket.isConnected) {
      return this.socket;
    }

    const sessionWrapper = SessionManager.getInstance().getSession();
    if (!sessionWrapper) {
      throw new Error("[MatchmakingService] Nenhum usuário autenticado para conectar o socket.");
    }

    // Assumindo que seu modelo `Session.ts` expõe a sessão original do Nakama.
    // Ajuste "getNakamaSession()" conforme a sua implementação do wrapper.
    const rawSession: NakamaSession = (sessionWrapper as any).nakamaSession || (sessionWrapper as any).getNakamaSession?.();

    if (!rawSession) {
      throw new Error("[MatchmakingService] Sessão do Nakama indisponível no wrapper.");
    }

    const client = NakamaClient.getInstance().getClient();
    
    // createSocket(useSSL, verbose)
    this.socket = client.createSocket(false, false);

    try {
      console.log("[MatchmakingService] Conectando Socket...");
      await this.socket.connect(rawSession, true);
      console.log("[MatchmakingService] Socket conectado com sucesso.");
      return this.socket;
    } catch (error) {
      console.error("[MatchmakingService] Erro ao conectar o socket:", error);
      throw error;
    }
  }

  /**
   * Envia a requisição para entrar na fila de matchmaking.
   */
  public async enterQueue(minPlayers: number, maxPlayers: number, query: string = "*"): Promise<string> {
    try {
      const socket = await this.ensureSocketConnected();
      console.log(`[MatchmakingService] Entrando na fila (min: ${minPlayers}, max: ${maxPlayers})...`);

      const response = await socket.addMatchmaker(query, minPlayers, maxPlayers);
      this.currentTicket = response.ticket;

      console.log(`[MatchmakingService] Fila criada. Ticket: ${this.currentTicket}`);
      return this.currentTicket;
    } catch (error) {
      console.error("[MatchmakingService] Falha ao entrar na fila:", error);
      throw error;
    }
  }

  /**
   * Cancela a busca por partida utilizando o ticket atual.
   */
  public async cancelQueue(): Promise<void> {
    if (!this.currentTicket) {
      console.warn("[MatchmakingService] Nenhum ticket ativo para cancelar.");
      return;
    }

    try {
      const socket = await this.ensureSocketConnected();
      console.log("[MatchmakingService] Cancelando fila...");

      await socket.removeMatchmaker(this.currentTicket);
      this.currentTicket = null;

      console.log("[MatchmakingService] Fila cancelada com sucesso.");
    } catch (error) {
      console.error("[MatchmakingService] Erro ao cancelar fila:", error);
      throw error;
    }
  }

  /**
   * Registra um callback para reagir quando uma partida for encontrada.
   */
  public async onMatchFound(callback: (matchId: string) => void): Promise<void> {
    const socket = await this.ensureSocketConnected();

    socket.onmatchmakermatched = (matched: MatchmakerMatched) => {
      console.log("[MatchmakingService] MatchmakerMatched recebido:", matched);
      
      // O Nakama pode retornar match_id (se o servidor autoritativo interceptou e gerou a partida)
      // ou token (se a partida for resolvida pelo cliente P2P).
      // Como a arquitetura do projeto é autoritativa, priorizamos o match_id.
      const matchId = matched.match_id || matched.token;
      
      if (matchId) {
        console.log(`[MatchmakingService] Partida confirmada! ID: ${matchId}`);
        this.currentTicket = null; // Limpa o estado local
        callback(matchId);
      } else {
        console.error("[MatchmakingService] Erro crítico: MatchId nulo recebido do Nakama.");
      }
    };
  }
}