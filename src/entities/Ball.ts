import { PlayerId } from "./Player";

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly radius: number;
  readonly holderId: PlayerId | null;
}

export class Ball {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public readonly radius: number;
  public holderId: PlayerId | null;

  public constructor(x: number, y: number, radius: number, holderId: PlayerId | null = null) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = radius;
    this.holderId = holderId;
  }

  public getState(): BallState {
    return { x: this.x, y: this.y, vx: this.vx, vy: this.vy, radius: this.radius, holderId: this.holderId };
  }
}