export type PlayerId = "player1" | "player2";
export type FacingDirection = "left" | "right";

export interface PlayerState {
  readonly id: PlayerId;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly width: number;
  readonly height: number;
  readonly isGrounded: boolean;
  readonly facingDirection: FacingDirection;
}

export class Player {
  public readonly id: PlayerId;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public readonly width: number;
  public readonly height: number;
  public isGrounded: boolean;
  public facingDirection: FacingDirection;

  public constructor(id: PlayerId, x: number, y: number, width: number, height: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = width;
    this.height = height;
    this.isGrounded = false;
    this.facingDirection = id === "player1" ? "right" : "left";
  }

  public getState(): PlayerState {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
      width: this.width,
      height: this.height,
      isGrounded: this.isGrounded,
      facingDirection: this.facingDirection,
    };
  }
}