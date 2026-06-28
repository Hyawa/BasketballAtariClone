export class QueueTimer {
  private readonly element: HTMLParagraphElement;

  public constructor() {
    this.element = document.createElement("p");
    this.element.className = "queue-timer";
    this.element.textContent = "00:00";
  }

  public render(): HTMLParagraphElement {
    return this.element;
  }

  public update(elapsedSeconds: number): void {
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
    const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
    this.element.textContent = `${minutes}:${seconds}`;
  }

  public reset(): void {
    this.element.textContent = "00:00";
  }
}