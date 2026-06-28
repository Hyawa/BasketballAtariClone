import { Button } from "../Button";

export class FindMatchButton {
  private readonly button: Button;

  public constructor(onClick: () => void) {
    this.button = new Button({ label: "Encontrar Partida", variant: "primary", onClick });
  }

  public render(): HTMLButtonElement {
    return this.button.render();
  }
}