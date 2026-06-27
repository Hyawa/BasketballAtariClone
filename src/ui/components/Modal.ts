export interface ModalOptions {
  readonly title: string;
  readonly message: string;
  readonly onClose?: () => void;
}

export class Modal {
  private readonly overlay: HTMLDivElement;

  public constructor(options: ModalOptions) {
    this.overlay = document.createElement("div");
    this.overlay.className = "modal-overlay";

    const box = document.createElement("div");
    box.className = "modal-box";

    const title = document.createElement("h3");
    title.className = "modal-box__title";
    title.textContent = options.title;

    const message = document.createElement("p");
    message.className = "modal-box__message";
    message.textContent = options.message;

    const closeButton = document.createElement("button");
    closeButton.className = "modal-box__close";
    closeButton.textContent = "Fechar";
    closeButton.addEventListener("click", () => {
      this.close();
      options.onClose?.();
    });

    box.appendChild(title);
    box.appendChild(message);
    box.appendChild(closeButton);
    this.overlay.appendChild(box);
  }

  public open(parent: HTMLElement): void {
    parent.appendChild(this.overlay);
  }

  public close(): void {
    this.overlay.remove();
  }
}