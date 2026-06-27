export type ButtonVariant = "primary" | "secondary";

export interface ButtonOptions {
  readonly label: string;
  readonly variant?: ButtonVariant;
  readonly onClick: () => void;
}

export class Button {
  private readonly element: HTMLButtonElement;

  public constructor(options: ButtonOptions) {
    this.element = document.createElement("button");
    this.element.textContent = options.label;
    this.element.className = `btn btn--${options.variant ?? "primary"}`;
    this.element.addEventListener("click", options.onClick);
  }

  public render(): HTMLButtonElement {
    return this.element;
  }

  public setDisabled(disabled: boolean): void {
    this.element.disabled = disabled;
  }
}