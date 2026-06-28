import { FriendRequest } from "../../../types/Lobby";

export interface FriendRequestCardOptions {
  readonly request: FriendRequest;
  readonly onAccept: (requestId: string) => void;
  readonly onReject: (requestId: string) => void;
}

export class FriendRequestCard {
  private readonly element: HTMLDivElement;

  public constructor(options: FriendRequestCardOptions) {
    const { request } = options;

    this.element = document.createElement("div");
    this.element.className = "friend-request-card";

    const avatar = document.createElement("div");
    avatar.className = "friend-request-card__avatar";
    avatar.textContent = request.avatarInitial;

    const name = document.createElement("p");
    name.className = "friend-request-card__name";
    name.textContent = request.name;

    const acceptButton = document.createElement("button");
    acceptButton.className = "friend-request-card__accept";
    acceptButton.textContent = "Aceitar";
    acceptButton.addEventListener("click", () => options.onAccept(request.id));

    const rejectButton = document.createElement("button");
    rejectButton.className = "friend-request-card__reject";
    rejectButton.textContent = "Recusar";
    rejectButton.addEventListener("click", () => options.onReject(request.id));

    this.element.appendChild(avatar);
    this.element.appendChild(name);
    this.element.appendChild(acceptButton);
    this.element.appendChild(rejectButton);
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}