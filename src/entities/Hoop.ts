import { PlayerId } from "./Player";

export interface HoopState {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export class Hoop {
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly scoringPlayerId: PlayerId;

  public constructor(x: number, y: number, width: number, height: number, scoringPlayerId: PlayerId) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scoringPlayerId = scoringPlayerId;
  }

  public getState(): HoopState {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}