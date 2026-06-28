import { QueueType } from "../../../types/Lobby";

export interface QueueSelectorOptions {
  readonly initialValue: QueueType;
  readonly onChange: (value: QueueType) => void;
}

export class QueueSelector {
  private readonly element: HTMLDivElement;
  private readonly normalButton: HTMLButtonElement;
  private readonly rankedButton: HTMLButtonElement;
  private selectedValue: QueueType;
  private readonly onChange: (value: QueueType) => void;

  public constructor(options: QueueSelectorOptions) {
    this.selectedValue = options.initialValue;
    this.onChange = options.onChange;

    this.element = document.createElement("div");
    this.element.className = "queue-selector";

    this.normalButton = this.createOptionButton("Normal Game", "normal");
    this.rankedButton = this.createOptionButton("Ranked", "ranked");

    this.element.appendChild(this.normalButton);
    this.element.appendChild(this.rankedButton);
    this.updateActiveStyles();
  }

  public render(): HTMLDivElement {
    return this.element;
  }

  public getValue(): QueueType {
    return this.selectedValue;
  }

  private createOptionButton(label: string, value: QueueType): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "queue-selector__option";
    button.textContent = label;
    button.addEventListener("click", () => this.select(value));
    return button;
  }

  private select(value: QueueType): void {
    if (this.selectedValue === value) {
      return;
    }
    this.selectedValue = value;
    this.updateActiveStyles();
    console.log(`[Lobby] Fila selecionada: ${value}`);
    this.onChange(value);
  }

  private updateActiveStyles(): void {
    this.normalButton.classList.toggle("queue-selector__option--active", this.selectedValue === "normal");
    this.rankedButton.classList.toggle("queue-selector__option--active", this.selectedValue === "ranked");
  }
}