import { PlayerId, PlayerState } from "../entities/Player";
import { BallState } from "../entities/Ball";
import { HoopState } from "../entities/Hoop";
import { ScoreState } from "../game/ScoreManager";

export interface RenderState {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly ball: BallState;
  readonly score: ScoreState;
}

export class DomRenderer {
  private courtElement: HTMLDivElement | null = null;
  private player1Element: HTMLDivElement | null = null;
  private player2Element: HTMLDivElement | null = null;
  private ballElement: HTMLDivElement | null = null;
  private scoreElement: HTMLParagraphElement | null = null;
  private bannerElement: HTMLDivElement | null = null;

  public mount(container: HTMLElement, hoops: ReadonlyArray<HoopState>): void {
    this.courtElement = document.createElement("div");
    this.courtElement.className = "court";

    const centerLine = document.createElement("div");
    centerLine.className = "court__center-line";
    this.courtElement.appendChild(centerLine);

    for (const hoop of hoops) {
      const hoopElement = document.createElement("div");
      hoopElement.className = "court__hoop";
      hoopElement.style.left = `${hoop.x}px`;
      hoopElement.style.top = `${hoop.y}px`;
      hoopElement.style.width = `${hoop.width}px`;
      hoopElement.style.height = `${hoop.height}px`;
      this.courtElement.appendChild(hoopElement);
    }

    this.player1Element = document.createElement("div");
    this.player1Element.className = "court__player court__player--one";
    this.courtElement.appendChild(this.player1Element);

    this.player2Element = document.createElement("div");
    this.player2Element.className = "court__player court__player--two";
    this.courtElement.appendChild(this.player2Element);

    this.ballElement = document.createElement("div");
    this.ballElement.className = "court__ball";
    this.courtElement.appendChild(this.ballElement);

    container.appendChild(this.courtElement);
    console.log("[Renderer] Quadra criada.");
  }

  public mountScore(container: HTMLElement): void {
    this.scoreElement = document.createElement("p");
    this.scoreElement.className = "hud__score";
    container.appendChild(this.scoreElement);
  }

  public render(state: RenderState): void {
    this.applyPlayerState(this.player1Element, state.player1);
    this.applyPlayerState(this.player2Element, state.player2);
    this.applyBallState(state.ball);
    this.applyScoreState(state.score);
  }

  public showScoreBanner(scoringPlayerId: PlayerId, score: ScoreState): void {
    if (this.courtElement === null) {
      return;
    }

    if (this.bannerElement === null) {
      this.bannerElement = document.createElement("div");
      this.bannerElement.className = "court__score-banner";
      this.courtElement.appendChild(this.bannerElement);
    }

    const scorerLabel = scoringPlayerId === "player1" ? "Jogador 1" : "Jogador 2";

    this.bannerElement.innerHTML = "";

    const title = document.createElement("p");
    title.className = "court__score-banner-title";
    title.textContent = `🏀 Ponto do ${scorerLabel}!`;

    const scoreLine = document.createElement("p");
    scoreLine.className = "court__score-banner-score";
    scoreLine.textContent = `${score.player1} x ${score.player2}`;

    this.bannerElement.appendChild(title);
    this.bannerElement.appendChild(scoreLine);
    this.bannerElement.classList.add("court__score-banner--visible");
  }

  public hideScoreBanner(): void {
    this.bannerElement?.classList.remove("court__score-banner--visible");
  }

  public unmount(): void {
    this.courtElement?.remove();
    this.scoreElement?.remove();
    this.courtElement = null;
    this.player1Element = null;
    this.player2Element = null;
    this.ballElement = null;
    this.scoreElement = null;
    this.bannerElement = null;
  }

  private applyPlayerState(element: HTMLDivElement | null, player: PlayerState): void {
    if (element === null) {
      return;
    }
    element.style.left = `${player.x}px`;
    element.style.top = `${player.y}px`;
    element.style.width = `${player.width}px`;
    element.style.height = `${player.height}px`;
  }

  private applyBallState(ball: BallState): void {
    if (this.ballElement === null) {
      return;
    }
    const diameter = ball.radius * 2;
    this.ballElement.style.left = `${ball.x - ball.radius}px`;
    this.ballElement.style.top = `${ball.y - ball.radius}px`;
    this.ballElement.style.width = `${diameter}px`;
    this.ballElement.style.height = `${diameter}px`;
  }

  private applyScoreState(score: ScoreState): void {
    if (this.scoreElement === null) {
      return;
    }
    this.scoreElement.textContent = `P1: ${score.player1}   P2: ${score.player2}`;
  }
}