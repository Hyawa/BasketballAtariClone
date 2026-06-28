import { FriendRequest } from "../../../types/Lobby";
import { FriendRequestCard } from "./FriendRequestCard";

export class FriendRequests {
  private readonly element: HTMLDivElement;
  private readonly listElement: HTMLDivElement;
  private requests: FriendRequest[];

  public constructor(initialRequests: ReadonlyArray<FriendRequest>) {
    this.requests = [...initialRequests];

    this.element = document.createElement("div");
    this.element.className = "friend-requests";

    const title = document.createElement("h3");
    title.className = "friend-requests__title";
    title.textContent = "Solicitações de Amizade";

    this.listElement = document.createElement("div");
    this.listElement.className = "friend-requests__list";

    this.element.appendChild(title);
    this.element.appendChild(this.listElement);
    this.renderList();
  }

  public render(): HTMLDivElement {
    return this.element;
  }

  private renderList(): void {
    this.listElement.innerHTML = "";

    if (this.requests.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "friend-requests__empty";
      emptyMessage.textContent = "Nenhuma solicitação pendente.";
      this.listElement.appendChild(emptyMessage);
      return;
    }

    for (const request of this.requests) {
      const card = new FriendRequestCard({
        request,
        onAccept: (requestId) => this.handleAccept(requestId),
        onReject: (requestId) => this.handleReject(requestId),
      });
      this.listElement.appendChild(card.render());
    }
  }

  private handleAccept(requestId: string): void {
    console.log(`[FriendRequests] Solicitação ${requestId} aceita (mock).`);
    this.removeRequest(requestId);
  }

  private handleReject(requestId: string): void {
    console.log(`[FriendRequests] Solicitação ${requestId} recusada (mock).`);
    this.removeRequest(requestId);
  }

  private removeRequest(requestId: string): void {
    this.requests = this.requests.filter((request) => request.id !== requestId);
    this.renderList();
  }
}