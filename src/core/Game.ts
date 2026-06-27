import { GameConfig } from "./GameConfig";
import { GameLoop } from "./GameLoop";
import { Physics } from "./Physics";
import { Player, PlayerId } from "../entities/Player";
import { Ball } from "../entities/Ball";
import { Hoop } from "../entities/Hoop";
import { Keyboard } from "../input/Keyboard";
import { DomRenderer, RenderState } from "../renderer/DomRenderer";
import { ScoreManager } from "../game/ScoreManager";
import { CollisionManager } from "../game/CollisionManager";
import { PossessionManager } from "../game/PossessionManager";
import { ShotResolver, ShotType } from "../game/ShotResolver";
import { BotController, BotContext } from "../ai/BotController";

export class Game {
  private readonly player1: Player;
  private readonly player2: Player;
  private readonly ball: Ball;
  private readonly hoops: ReadonlyArray<Hoop>;
  private readonly keyboard: Keyboard;
  private readonly renderer: DomRenderer;
  private readonly scoreManager: ScoreManager;
  private readonly collisionManager: CollisionManager;
  private readonly possessionManager: PossessionManager;
  private readonly shotResolver: ShotResolver;
  private readonly botController: BotController;
  private readonly gameLoop: GameLoop;

  private isPaused: boolean = false;
  private restartTimerSeconds: number = 0;
  private pendingConcededPlayerId: PlayerId | null = null;

  public constructor() {
    console.log("[Game] Inicializando SinglePlayer...");

    this.player1 = new Player(
      "player1",
      GameConfig.COURT_WIDTH * GameConfig.PLAYER1_START_X_RATIO,
      GameConfig.FLOOR_Y - GameConfig.PLAYER_HEIGHT,
      GameConfig.PLAYER_WIDTH,
      GameConfig.PLAYER_HEIGHT,
    );

    this.player2 = new Player(
      "player2",
      GameConfig.COURT_WIDTH * GameConfig.PLAYER2_START_X_RATIO,
      GameConfig.FLOOR_Y - GameConfig.PLAYER_HEIGHT,
      GameConfig.PLAYER_WIDTH,
      GameConfig.PLAYER_HEIGHT,
    );

    this.ball = new Ball(
      this.player1.x + this.player1.width / 2,
      this.player1.y,
      GameConfig.BALL_RADIUS,
      this.player1.id,
    );

    this.hoops = [
      new Hoop(20, GameConfig.HOOP_Y, GameConfig.HOOP_WIDTH, GameConfig.HOOP_HEIGHT, "player2"),
      new Hoop(
        GameConfig.COURT_WIDTH - 20 - GameConfig.HOOP_WIDTH,
        GameConfig.HOOP_Y,
        GameConfig.HOOP_WIDTH,
        GameConfig.HOOP_HEIGHT,
        "player1",
      ),
    ];

    this.keyboard = new Keyboard();
    this.renderer = new DomRenderer();
    this.scoreManager = new ScoreManager();
    this.collisionManager = new CollisionManager(this.scoreManager);
    this.possessionManager = new PossessionManager();
    this.shotResolver = new ShotResolver();
    this.botController = new BotController("player2");
    this.gameLoop = new GameLoop(
      (deltaSeconds) => this.update(deltaSeconds),
      () => this.render(),
    );
  }

  public start(courtContainer: HTMLElement, scoreContainer: HTMLElement): void {
    this.renderer.mount(courtContainer, this.hoops.map((hoop) => hoop.getState()));
    this.renderer.mountScore(scoreContainer);
    this.keyboard.attach();
    this.gameLoop.start();
  }

  public stop(): void {
    this.gameLoop.stop();
    this.keyboard.detach();
    this.renderer.unmount();
  }

  private update(deltaSeconds: number): void {
    if (this.isPaused) {
      this.updatePause(deltaSeconds);
      return;
    }

    this.updatePlayer1(deltaSeconds);
    this.updatePlayer2(deltaSeconds);
    this.syncBallToHolder();
    this.updateFreeBallPhysics(deltaSeconds);

    if (this.ball.holderId === null) {
      this.collisionManager.resolveGroundCollision(this.ball);
      this.collisionManager.resolveWallCollision(this.ball);

      const scoringPlayerId = this.collisionManager.resolveHoopCollision(this.ball, this.hoops);
      if (scoringPlayerId !== null) {
        this.handleBasketScored(scoringPlayerId);
        return;
      }
    }

    this.possessionManager.resolvePossession(this.ball, this.player1, this.player2, deltaSeconds);
  }

  private render(): void {
    const state: RenderState = {
      player1: this.player1.getState(),
      player2: this.player2.getState(),
      ball: this.ball.getState(),
      score: this.scoreManager.getState(),
    };
    this.renderer.render(state);
  }

  private updatePlayer1(deltaSeconds: number): void {
    this.player1.vx = 0;

    if (this.keyboard.isPressed("KeyA")) {
      this.player1.vx = -GameConfig.PLAYER_SPEED;
    }
    if (this.keyboard.isPressed("KeyD")) {
      this.player1.vx = GameConfig.PLAYER_SPEED;
    }

    if (this.player1.vx > 0) {
      this.player1.facingDirection = "right";
    } else if (this.player1.vx < 0) {
      this.player1.facingDirection = "left";
    }

    if (this.keyboard.consumeJustPressed("KeyW") && this.player1.isGrounded) {
      console.log("[Input] W pressionado.");
      this.player1.vy = GameConfig.JUMP_VELOCITY;
      this.player1.isGrounded = false;
    }

    this.applyGroundedPhysics(this.player1, deltaSeconds);
    this.handlePlayer1Throw();
  }

  private updatePlayer2(deltaSeconds: number): void {
    const decision = this.botController.update(deltaSeconds, this.buildBotContext());

    this.player2.vx = decision.moveDirection * GameConfig.PLAYER_SPEED * GameConfig.BOT_SPEED_FACTOR;
    if (decision.moveDirection > 0) {
      this.player2.facingDirection = "right";
    } else if (decision.moveDirection < 0) {
      this.player2.facingDirection = "left";
    }

    if (decision.shouldJump && this.player2.isGrounded) {
      this.player2.vy = GameConfig.JUMP_VELOCITY;
      this.player2.isGrounded = false;
    }

    this.applyGroundedPhysics(this.player2, deltaSeconds);

    if (decision.shouldShoot && this.ball.holderId === this.player2.id) {
      this.throwBall(this.player2, "high");
    }
  }

  private applyGroundedPhysics(player: Player, deltaSeconds: number): void {
    Physics.applyGravity(player, deltaSeconds);
    Physics.integrate(player, deltaSeconds);
    Physics.clampHorizontal(player, 0, GameConfig.COURT_WIDTH - player.width);

    const floorLimit = GameConfig.FLOOR_Y - player.height;
    if (player.y >= floorLimit) {
      player.y = floorLimit;
      player.vy = 0;
      player.isGrounded = true;
    }
  }

  private handlePlayer1Throw(): void {
    if (!this.keyboard.consumeJustPressed("Space")) {
      return;
    }
    if (this.ball.holderId !== this.player1.id) {
      return;
    }

    console.log("[Input] Espaço pressionado.");

    const shotType = this.shotResolver.resolveShotType(
      {
        isLeftPressed: this.keyboard.isPressed("KeyA"),
        isRightPressed: this.keyboard.isPressed("KeyD"),
        isJumping: !this.player1.isGrounded,
      },
      this.player1.facingDirection,
    );

    this.throwBall(this.player1, shotType);
  }

  private throwBall(shooter: Player, shotType: ShotType): void {
    const velocity = this.shotResolver.computeVelocity(shotType, shooter.id);
    this.ball.holderId = null;
    this.ball.vx = velocity.vx;
    this.ball.vy = velocity.vy;
    this.possessionManager.startReleaseCooldown();
    console.log(`[Game] ${shooter.id} arremessou (${shotType}).`);
  }

  private syncBallToHolder(): void {
    if (this.ball.holderId === null) {
      return;
    }
    const holder = this.ball.holderId === this.player1.id ? this.player1 : this.player2;
    this.ball.x = holder.x + holder.width / 2;
    this.ball.y = holder.y;
    this.ball.vx = 0;
    this.ball.vy = 0;
  }

  private updateFreeBallPhysics(deltaSeconds: number): void {
    if (this.ball.holderId !== null) {
      return;
    }
    Physics.applyGravity(this.ball, deltaSeconds);
    Physics.integrate(this.ball, deltaSeconds);
  }

  // --- Nova lógica de reinício após cesta ---

  private handleBasketScored(scoringPlayerId: PlayerId): void {
    const concededPlayerId = scoringPlayerId === this.player1.id ? this.player2.id : this.player1.id;

    this.pendingConcededPlayerId = concededPlayerId;
    this.isPaused = true;
    this.restartTimerSeconds = GameConfig.RESTART_DELAY_SECONDS;

    this.freezeEntities();
    this.renderer.showScoreBanner(scoringPlayerId, this.scoreManager.getState());

    console.log(`[Game] Cesta de ${scoringPlayerId}. Reinício em ${GameConfig.RESTART_DELAY_SECONDS}s.`);
  }

  private updatePause(deltaSeconds: number): void {
    this.restartTimerSeconds -= deltaSeconds;
    if (this.restartTimerSeconds > 0) {
      return;
    }

    this.isPaused = false;
    this.renderer.hideScoreBanner();
    this.resetAfterBasket(this.pendingConcededPlayerId);
    this.pendingConcededPlayerId = null;
  }

  private freezeEntities(): void {
    this.player1.vx = 0;
    this.player1.vy = 0;
    this.player2.vx = 0;
    this.player2.vy = 0;
    this.ball.vx = 0;
    this.ball.vy = 0;
  }

  private resetAfterBasket(concededPlayerId: PlayerId | null): void {
    this.resetPlayerToStart(this.player1);
    this.resetPlayerToStart(this.player2);

    const receiver = concededPlayerId === this.player2.id ? this.player2 : this.player1;

    this.ball.holderId = receiver.id;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.x = receiver.x + receiver.width / 2;
    this.ball.y = receiver.y;

    console.log(`[Game] Jogada reiniciada. Bola entregue a ${receiver.id}.`);
  }

  private resetPlayerToStart(player: Player): void {
    const startXRatio =
      player.id === "player1" ? GameConfig.PLAYER1_START_X_RATIO : GameConfig.PLAYER2_START_X_RATIO;

    player.x = GameConfig.COURT_WIDTH * startXRatio;
    player.y = GameConfig.FLOOR_Y - player.height;
    player.vx = 0;
    player.vy = 0;
    player.isGrounded = true;
  }

  private buildBotContext(): BotContext {
    const opponentHoop = this.hoops.find((hoop) => hoop.scoringPlayerId === this.player2.id);
    const ownHoop = this.hoops.find((hoop) => hoop.scoringPlayerId === this.player1.id);

    return {
      self: this.player2.getState(),
      opponent: this.player1.getState(),
      ball: this.ball.getState(),
      opponentHoopX: opponentHoop ? opponentHoop.x + opponentHoop.width / 2 : 0,
      ownHoopX: ownHoop ? ownHoop.x + ownHoop.width / 2 : GameConfig.COURT_WIDTH,
    };
  }
}