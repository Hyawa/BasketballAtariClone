export class Keyboard {
  private readonly pressedKeys: Set<string> = new Set();
  private readonly justPressedKeys: Set<string> = new Set();
  private readonly handleKeyDown: (event: KeyboardEvent) => void;
  private readonly handleKeyUp: (event: KeyboardEvent) => void;

  public constructor() {
    this.handleKeyDown = (event: KeyboardEvent): void => {
      if (!this.pressedKeys.has(event.code)) {
        this.justPressedKeys.add(event.code);
      }
      this.pressedKeys.add(event.code);
    };

    this.handleKeyUp = (event: KeyboardEvent): void => {
      this.pressedKeys.delete(event.code);
    };
  }

  public attach(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    console.log("[Input] Teclado conectado.");
  }

  public detach(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  public isPressed(code: string): boolean {
    return this.pressedKeys.has(code);
  }

  public consumeJustPressed(code: string): boolean {
    if (this.justPressedKeys.has(code)) {
      this.justPressedKeys.delete(code);
      return true;
    }
    return false;
  }
}