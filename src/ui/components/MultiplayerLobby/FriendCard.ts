import { Friend } from "../../../types/Lobby";

export class FriendCard {
  private readonly element: HTMLDivElement;

  public constructor(friend: Friend) {
    this.element = document.createElement("div");
    this.element.className = "friend-card";

    const avatar = document.createElement("div");
    avatar.className = "friend-card__avatar";
    avatar.textContent = friend.avatarInitial;

    const info = document.createElement("div");
    info.className = "friend-card__info";

    const name = document.createElement("p");
    name.className = "friend-card__name";
    name.textContent = friend.name;

    const status = document.createElement("p");
    status.className = "friend-card__status";
    status.textContent = friend.statusLabel;

    info.appendChild(name);
    info.appendChild(status);

    const actions = document.createElement("div");
    actions.className = "friend-card__actions";

    const inviteButton = document.createElement("button");
    inviteButton.className = "friend-card__action-btn";
    inviteButton.textContent = "Convidar";
    inviteButton.disabled = true;

    const chatButton = document.createElement("button");
    chatButton.className = "friend-card__action-btn";
    chatButton.textContent = "Chat";
    chatButton.disabled = true;

    actions.appendChild(inviteButton);
    actions.appendChild(chatButton);

    this.element.appendChild(avatar);
    this.element.appendChild(info);
    this.element.appendChild(actions);
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}