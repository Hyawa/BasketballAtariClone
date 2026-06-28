import { QueueStateManager } from "../../../state/QueueStateManager";
import { FindMatchButton } from "./FindMatchButton";
import { CancelQueueButton } from "./CancelQueueButton";
import { QueueTimer } from "./QueueTimer";
import { QueueUiState } from "../../../types/Lobby";

export class QueueStatus {
  private readonly element: HTMLDivElement;
  private readonly descriptionElement: HTMLParagraphElement;
  private readonly queueingLabel: HTMLParagraphElement;
  private readonly timer: QueueTimer;
  private readonly findMatchButton: FindMatchButton;
  private readonly cancelQueueButton: CancelQueueButton;
  private readonly stateManager: QueueStateManager;

  public constructor() {
    this.stateManager = new QueueStateManager(
      (elapsedSeconds) => this.timer.update(elapsedSeconds),
      (state) => this.applyState(state),
    );

    this.element = document.createElement("div");
    this.element.className = "queue-status";

    this.descriptionElement = document.createElement("p");
    this.descriptionElement.className = "queue-status__description";

    this.queueingLabel = document.createElement("p");
    this.queueingLabel.className = "queue-status__label";
    this.queueingLabel.textContent = "Procurando partida...";

    this.timer = new QueueTimer();

    this.findMatchButton = new FindMatchButton(() => this.stateManager.start());
    this.cancelQueueButton = new CancelQueueButton(() => this.stateManager.cancel());

    this.element.appendChild(this.descriptionElement);
    this.element.appendChild(this.queueingLabel);
    this.element.appendChild(this.timer.render());
    this.element.appendChild(this.findMatchButton.render());
    this.element.appendChild(this.cancelQueueButton.render());

    this.applyState("idle");
  }

  public render(): HTMLDivElement {
    return this.element;
  }

  public setDescription(text: string): void {
    this.descriptionElement.textContent = text;
  }

  public dispose(): void {
    this.stateManager.dispose();
  }

  private applyState(state: QueueUiState): void {
    const isQueueing = state === "queueing";

    this.queueingLabel.classList.toggle("queue-status__label--visible", isQueueing);
    this.timer.render().classList.toggle("queue-timer--visible", isQueueing);
    this.findMatchButton.render().classList.toggle("queue-status__hidden", isQueueing);
    this.cancelQueueButton.render().classList.toggle("queue-status__hidden", !isQueueing);

    if (!isQueueing) {
      this.timer.reset();
    }
  }
}