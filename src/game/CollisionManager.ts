import { Ball } from "../entities/Ball";
import { Hoop } from "../entities/Hoop";
import { GameConfig } from "../core/GameConfig";
import { ScoreManager } from "./ScoreManager";
import { PlayerId } from "../entities/Player";

export class CollisionManager {
  private readonly scoreManager: ScoreManager;

  public constructor(scoreManager: ScoreManager) {
    this.scoreManager = scoreManager;
  }

  public resolveGroundCollision(ball: Ball): void {
    const floorLimit = GameConfig.FLOOR_Y - ball.radius;
    if (ball.y < floorLimit) {
      return;
    }

    ball.y = floorLimit;

    if (Math.abs(ball.vy) > GameConfig.MIN_BOUNCE_VELOCITY) {
      ball.vy = -ball.vy * GameConfig.GROUND_BOUNCE_DAMPING;
      console.log("[Collision] Bola colidiu com o chão.");
    } else {
      ball.vy = 0;
    }
  }

  public resolveWallCollision(ball: Ball): void {
    if (ball.x - ball.radius <= 0) {
      ball.x = ball.radius;
      ball.vx = -ball.vx * GameConfig.GROUND_BOUNCE_DAMPING;
      console.log("[Collision] Bola colidiu com a parede esquerda.");
    }

    if (ball.x + ball.radius >= GameConfig.COURT_WIDTH) {
      ball.x = GameConfig.COURT_WIDTH - ball.radius;
      ball.vx = -ball.vx * GameConfig.GROUND_BOUNCE_DAMPING;
      console.log("[Collision] Bola colidiu com a parede direita.");
    }
  }

  // Único ajuste: retorna quem marcou (PlayerId) em vez de apenas boolean.
  // Detecção de colisão e cálculo de pontos permanecem inalterados.
  public resolveHoopCollision(ball: Ball, hoops: ReadonlyArray<Hoop>): PlayerId | null {
    if (ball.vy <= 0) {
      return null;
    }

    for (const hoop of hoops) {
      const isInsideHoop =
        ball.x >= hoop.x &&
        ball.x <= hoop.x + hoop.width &&
        ball.y >= hoop.y &&
        ball.y <= hoop.y + hoop.height;

      if (isInsideHoop) {
        this.scoreManager.addPoints(hoop.scoringPlayerId, GameConfig.SCORE_POINTS);
        console.log(`[Score] ${hoop.scoringPlayerId} marcou ${GameConfig.SCORE_POINTS} pontos.`);
        return hoop.scoringPlayerId;
      }
    }

    return null;
  }
}