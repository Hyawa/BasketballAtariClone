import { Friend, FriendRequest, Invite } from "../../../types/Lobby";
import { FriendList } from "./FriendList";
import { FriendRequests } from "./FriendRequests";
import { AddFriend } from "./AddFriend";
import { InvitesPanel } from "./InvitesPanel";

export interface FriendSidebarOptions {
  readonly onlineFriends: ReadonlyArray<Friend>;
  readonly offlineFriends: ReadonlyArray<Friend>;
  readonly friendRequests: ReadonlyArray<FriendRequest>;
  readonly invites: ReadonlyArray<Invite>;
}

export class FriendSidebar {
  private readonly element: HTMLDivElement;

  public constructor(options: FriendSidebarOptions) {
    this.element = document.createElement("div");
    this.element.className = "friend-sidebar";

    const onlineList = new FriendList({
      title: "Amigos Online",
      friends: options.onlineFriends,
      variant: "online",
    });

    const offlineList = new FriendList({
      title: "Amigos Offline",
      friends: options.offlineFriends,
      variant: "offline",
    });

    const requests = new FriendRequests(options.friendRequests);
    const addFriend = new AddFriend();
    const invitesPanel = new InvitesPanel(options.invites);

    this.element.appendChild(onlineList.render());
    this.element.appendChild(offlineList.render());
    this.element.appendChild(requests.render());
    this.element.appendChild(addFriend.render());
    this.element.appendChild(invitesPanel.render());
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}