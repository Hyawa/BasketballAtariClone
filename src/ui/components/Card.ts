export class Card {
  private readonly element: HTMLDivElement;

  public constructor() {
    this.element = document.createElement("div");
    this.element.className = "card";
  }

  public append(child: HTMLElement): void {
    this.element.appendChild(child);
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}