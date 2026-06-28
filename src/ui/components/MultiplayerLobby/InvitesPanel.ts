import { Invite } from "../../../types/Lobby";

export class InvitesPanel {
  private readonly element: HTMLDivElement;

  public constructor(invites: ReadonlyArray<Invite>) {
    this.element = document.createElement("div");
    this.element.className = "invites-panel";

    const title = document.createElement("h3");
    title.className = "invites-panel__title";
    title.textContent = "Convites";

    this.element.appendChild(title);

    if (invites.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "invites-panel__empty";
      emptyMessage.textContent = "Nenhum convite por enquanto.";
      this.element.appendChild(emptyMessage);
      return;
    }

    for (const invite of invites) {
      this.element.appendChild(this.buildInviteRow(invite));
    }
  }

  public render(): HTMLDivElement {
    return this.element;
  }

  private buildInviteRow(invite: Invite): HTMLDivElement {
    const row = document.createElement("div");
    row.className = "invites-panel__row";
    row.textContent = `${invite.fromName} convidou para ${invite.gameMode}`;
    return row;
  }
}