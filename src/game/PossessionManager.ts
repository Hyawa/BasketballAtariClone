import { Ball } from "../entities/Ball";
import { Player } from "../entities/Player";
import { GameConfig } from "../core/GameConfig";

export class PossessionManager {
  private cooldownSeconds: number = 0;

  public resolvePossession(ball: Ball, player1: Player, player2: Player, deltaSeconds: number): void {
  if (this.cooldownSeconds > 0) {
    this.cooldownSeconds -= deltaSeconds;
  }

  if (ball.holderId === null) {
    if (this.cooldownSeconds <= 0) {
      this.tryPickupFreeBall(ball, [player1, player2]);
    }
    return;
  }

  if (this.cooldownSeconds <= 0) {
    this.trySteal(ball, player1, player2);
  }
}

public startReleaseCooldown(): void {
  this.cooldownSeconds = GameConfig.POSSESSION_COOLDOWN_SECONDS;
}

  private tryPickupFreeBall(ball: Ball, players: ReadonlyArray<Player>): void {
    for (const player of players) {
      if (this.isBallOverlappingPlayer(ball, player)) {
        this.assignPossession(ball, player);
        return;
      }
    }
  }

  private trySteal(ball: Ball, player1: Player, player2: Player): void {
    const holder = ball.holderId === player1.id ? player1 : player2;
    const challenger = ball.holderId === player1.id ? player2 : player1;

    if (this.isPlayerOverlappingPlayer(holder, challenger)) {
      console.log(`[Possession] ${challenger.id} roubou a bola de ${holder.id}.`);
      this.assignPossession(ball, challenger);
    }
  }

  private assignPossession(ball: Ball, player: Player): void {
    const isNewPossession = ball.holderId !== player.id;
    ball.holderId = player.id;
    ball.vx = 0;
    ball.vy = 0;
    this.cooldownSeconds = GameConfig.POSSESSION_COOLDOWN_SECONDS;

    if (isNewPossession) {
      console.log(`[Possession] ${player.id} está com a bola.`);
    }
  }

  private isBallOverlappingPlayer(ball: Ball, player: Player): boolean {
    const closestX = Math.max(player.x, Math.min(ball.x, player.x + player.width));
    const closestY = Math.max(player.y, Math.min(ball.y, player.y + player.height));
    const distanceX = ball.x - closestX;
    const distanceY = ball.y - closestY;
    return distanceX * distanceX + distanceY * distanceY <= ball.radius * ball.radius;
  }

  private isPlayerOverlappingPlayer(a: Player, b: Player): boolean {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  
}