import { GameMode } from "../../../types/Lobby";

export interface GameModeSelectorOptions {
  readonly initialValue: GameMode;
  readonly onChange: (value: GameMode) => void;
}

export class GameModeSelector {
  private readonly element: HTMLDivElement;
  private readonly oneVOneButton: HTMLButtonElement;
  private readonly fiveVFiveButton: HTMLButtonElement;
  private selectedValue: GameMode;
  private readonly onChange: (value: GameMode) => void;

  public constructor(options: GameModeSelectorOptions) {
    this.selectedValue = options.initialValue;
    this.onChange = options.onChange;

    this.element = document.createElement("div");
    this.element.className = "game-mode-selector";

    this.oneVOneButton = this.createOptionButton("1v1", "1v1");
    this.fiveVFiveButton = this.createOptionButton("5v5", "5v5");

    this.element.appendChild(this.oneVOneButton);
    this.element.appendChild(this.fiveVFiveButton);
    this.updateActiveStyles();
  }

  public render(): HTMLDivElement {
    return this.element;
  }

  public getValue(): GameMode {
    return this.selectedValue;
  }

  private createOptionButton(label: string, value: GameMode): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "game-mode-selector__option";
    button.textContent = label;
    button.addEventListener("click", () => this.select(value));
    return button;
  }

  private select(value: GameMode): void {
    if (this.selectedValue === value) {
      return;
    }
    this.selectedValue = value;
    this.updateActiveStyles();
    console.log(`[Lobby] Modo selecionado: ${value}`);
    this.onChange(value);
  }

  private updateActiveStyles(): void {
    this.oneVOneButton.classList.toggle("game-mode-selector__option--active", this.selectedValue === "1v1");
    this.fiveVFiveButton.classList.toggle("game-mode-selector__option--active", this.selectedValue === "5v5");
  }
}