import { Friend } from "../../../types/Lobby";
import { FriendCard } from "./FriendCard";

export type FriendListVariant = "online" | "offline";

export interface FriendListOptions {
  readonly title: string;
  readonly friends: ReadonlyArray<Friend>;
  readonly variant: FriendListVariant;
}

export class FriendList {
  private readonly element: HTMLDivElement;

  public constructor(options: FriendListOptions) {
    this.element = document.createElement("div");
    this.element.className = "friend-list";

    const title = document.createElement("h3");
    title.className = "friend-list__title";
    title.textContent = `${options.title} (${options.friends.length})`;
    this.element.appendChild(title);

    for (const friend of options.friends) {
      this.element.appendChild(this.buildEntry(friend, options.variant));
    }
  }

  public render(): HTMLDivElement {
    return this.element;
  }

  private buildEntry(friend: Friend, variant: FriendListVariant): HTMLElement {
    if (variant === "online") {
      return new FriendCard(friend).render();
    }
    return this.buildOfflineRow(friend);
  }

  private buildOfflineRow(friend: Friend): HTMLDivElement {
    const row = document.createElement("div");
    row.className = "friend-list__offline-row";

    const name = document.createElement("span");
    name.className = "friend-list__offline-name";
    name.textContent = friend.name;

    const status = document.createElement("span");
    status.className = "friend-list__offline-status";
    status.textContent = friend.statusLabel;

    row.appendChild(name);
    row.appendChild(status);
    return row;
  }
}