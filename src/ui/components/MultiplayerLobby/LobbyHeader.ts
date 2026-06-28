import { Router } from "../../../app/Router";
import { Button } from "../../../ui/components/Button";

export class LobbyHeader {
  private readonly element: HTMLDivElement;

  public constructor(router: Router) {
    this.element = document.createElement("div");
    this.element.className = "lobby-header";

    const title = document.createElement("h1");
    title.className = "lobby-header__title";
    title.textContent = "Multiplayer";

    const backButton = new Button({
      label: "Voltar ao Menu",
      variant: "secondary",
      onClick: () => router.navigateTo("menu"),
    });

    this.element.appendChild(title);
    this.element.appendChild(backButton.render());
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}