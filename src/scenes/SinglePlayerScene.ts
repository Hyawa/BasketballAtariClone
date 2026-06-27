import { Screen, Router } from "../app/Router";
import { Button } from "../ui/components/Button";
import { Game } from "../core/Game";

export class SinglePlayerScene implements Screen {
  private readonly router: Router;
  private root: HTMLElement | null = null;
  private game: Game | null = null;

  public constructor(router: Router) {
    this.router = router;
  }

  public mount(container: HTMLElement): void {
    this.root = document.createElement("div");
    this.root.className = "screen screen--singleplayer";

    const hud = document.createElement("div");
    hud.className = "hud";

    const backButton = new Button({
      label: "Voltar ao Menu",
      variant: "secondary",
      onClick: () => this.router.navigateTo("menu"),
    });
    hud.appendChild(backButton.render());

    const courtWrapper = document.createElement("div");
    courtWrapper.className = "singleplayer__court-wrapper";

    this.root.appendChild(hud);
    this.root.appendChild(courtWrapper);
    container.appendChild(this.root);

    this.game = new Game();
    this.game.start(courtWrapper, hud);
  }

  public unmount(): void {
    this.game?.stop();
    this.game = null;
    this.root?.remove();
    this.root = null;
  }
}