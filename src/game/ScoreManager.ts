import { PlayerId } from "../entities/Player";

export interface ScoreState {
  readonly player1: number;
  readonly player2: number;
}

export class ScoreManager {
  private player1Score: number = 0;
  private player2Score: number = 0;

  public addPoints(playerId: PlayerId, points: number): void {
    if (playerId === "player1") {
      this.player1Score += points;
      return;
    }
    this.player2Score += points;
  }

  public getState(): ScoreState {
    return { player1: this.player1Score, player2: this.player2Score };
  }

  public reset(): void {
    this.player1Score = 0;
    this.player2Score = 0;
  }
}