export type UpdateCallback = (deltaSeconds: number) => void;
export type RenderCallback = () => void;

const MAX_DELTA_SECONDS = 0.05;

export class GameLoop {
  private animationFrameId: number | null = null;
  private lastTimestamp: number | null = null;
  private readonly update: UpdateCallback;
  private readonly render: RenderCallback;

  public constructor(update: UpdateCallback, render: RenderCallback) {
    this.update = update;
    this.render = render;
  }

  public start(): void {
    console.log("[GameLoop] Iniciado.");
    this.lastTimestamp = null;
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    console.log("[GameLoop] Parado.");
  }

  private readonly tick = (timestamp: number): void => {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
    }

    const deltaSeconds = Math.min((timestamp - this.lastTimestamp) / 1000, MAX_DELTA_SECONDS);
    this.lastTimestamp = timestamp;

    this.update(deltaSeconds);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}