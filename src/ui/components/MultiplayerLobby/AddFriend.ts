export class AddFriend {
  private readonly element: HTMLDivElement;
  private readonly inputElement: HTMLInputElement;

  public constructor() {
    this.element = document.createElement("div");
    this.element.className = "add-friend";

    const title = document.createElement("h3");
    title.className = "add-friend__title";
    title.textContent = "Adicionar Amigo";

    this.inputElement = document.createElement("input");
    this.inputElement.className = "add-friend__input";
    this.inputElement.type = "text";
    this.inputElement.placeholder = "Nome do jogador";

    const sendButton = document.createElement("button");
    sendButton.className = "add-friend__button";
    sendButton.textContent = "Enviar Solicitação";
    sendButton.addEventListener("click", () => this.handleSend());

    this.element.appendChild(title);
    this.element.appendChild(this.inputElement);
    this.element.appendChild(sendButton);
  }

  public render(): HTMLDivElement {
    return this.element;
  }

  private handleSend(): void {
    const value = this.inputElement.value.trim();
    if (value.length === 0) {
      return;
    }
    console.log(`[AddFriend] Solicitação simulada enviada para: ${value}`);
    this.inputElement.value = "";
  }
}