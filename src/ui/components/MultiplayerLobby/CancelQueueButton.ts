import { Button } from "../Button";

export class CancelQueueButton {
  private readonly button: Button;

  public constructor(onClick: () => void) {
    this.button = new Button({ label: "Cancelar Fila", variant: "danger", onClick });
  }

  public render(): HTMLButtonElement {
    return this.button.render();
  }
}