import { QueueUiState } from "../types/Lobby";

export type QueueTickHandler = (elapsedSeconds: number) => void;
export type QueueStateChangeHandler = (state: QueueUiState) => void;

export class QueueStateManager {
  private state: QueueUiState = "idle";
  private elapsedSeconds: number = 0;
  private intervalId: number | null = null;
  private readonly onTick: QueueTickHandler;
  private readonly onStateChange: QueueStateChangeHandler;

  public constructor(onTick: QueueTickHandler, onStateChange: QueueStateChangeHandler) {
    this.onTick = onTick;
    this.onStateChange = onStateChange;
  }

  public start(): void {
    if (this.state === "queueing") {
      return;
    }

    console.log("[Queue] Entrando na fila (mock, sem comunicação com servidor).");
    this.elapsedSeconds = 0;
    this.state = "queueing";
    this.onStateChange(this.state);
    this.onTick(this.elapsedSeconds);

    this.intervalId = window.setInterval(() => {
      this.elapsedSeconds += 1;
      this.onTick(this.elapsedSeconds);
    }, 1000);
  }

  public cancel(): void {
    if (this.state === "idle") {
      return;
    }

    console.log("[Queue] Fila cancelada.");
    this.clearTimer();
    this.elapsedSeconds = 0;
    this.state = "idle";
    this.onStateChange(this.state);
  }

  // Chamado pela Scene ao desmontar a tela. Sem isso, o setInterval
  // continuaria rodando em segundo plano após o jogador sair do lobby.
  public dispose(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}