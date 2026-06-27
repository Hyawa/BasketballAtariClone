import { GameConfig } from "../core/GameConfig";
import { PlayerId, PlayerState } from "../entities/Player";
import { BallState } from "../entities/Ball";

export type BotState = "idle" | "seekBall" | "attack" | "shoot" | "defend";

export interface BotContext {
  readonly self: PlayerState;
  readonly opponent: PlayerState;
  readonly ball: BallState;
  readonly opponentHoopX: number;
  readonly ownHoopX: number;
}

export interface BotDecision {
  readonly moveDirection: -1 | 0 | 1;
  readonly shouldJump: boolean;
  readonly shouldShoot: boolean;
}

const IDLE_DECISION: BotDecision = { moveDirection: 0, shouldJump: false, shouldShoot: false };

export class BotController {
  private readonly playerId: PlayerId;
  private state: BotState = "idle";
  private reactionTimer: number = 0;
  private nextReactionDelay: number = GameConfig.BOT_REACTION_MIN_SECONDS;
  private currentDecision: BotDecision = IDLE_DECISION;

  public constructor(playerId: PlayerId) {
    this.playerId = playerId;
  }

  public update(deltaSeconds: number, context: BotContext): BotDecision {
    this.reactionTimer += deltaSeconds;

    if (this.reactionTimer < this.nextReactionDelay) {
      return this.currentDecision;
    }

    this.reactionTimer = 0;
    this.scheduleNextReaction();
    this.currentDecision = this.decide(context);
    return this.currentDecision;
  }

  private scheduleNextReaction(): void {
    const min = GameConfig.BOT_REACTION_MIN_SECONDS;
    const max = GameConfig.BOT_REACTION_MAX_SECONDS;
    this.nextReactionDelay = min + Math.random() * (max - min);
  }

  private decide(context: BotContext): BotDecision {
    const nextState = this.resolveState(context);
    if (nextState !== this.state) {
      console.log(`[Bot] Estado alterado: ${this.state} -> ${nextState}`);
      this.state = nextState;
    }

    const decision = this.buildDecisionForState(this.state, context);
    return this.applyOccasionalError(decision);
  }

  private resolveState(context: BotContext): BotState {
    const hasBall = context.ball.holderId === this.playerId;

    if (hasBall) {
      const distanceToHoop = Math.abs(context.self.x - context.opponentHoopX);
      return distanceToHoop <= GameConfig.BOT_SHOOT_RANGE_X ? "shoot" : "attack";
    }

    if (context.ball.holderId === null) {
      return "seekBall";
    }

    return "defend";
  }

  private buildDecisionForState(state: BotState, context: BotContext): BotDecision {
    switch (state) {
      case "seekBall":
        return this.buildSeekBallDecision(context);
      case "attack":
        return this.buildMoveTowardDecision(context.self.x, context.opponentHoopX);
      case "shoot":
        return { moveDirection: 0, shouldJump: false, shouldShoot: true };
      case "defend":
        return this.buildMoveTowardDecision(context.self.x, context.opponent.x);
      default:
        return IDLE_DECISION;
    }
  }

  private buildSeekBallDecision(context: BotContext): BotDecision {
    const moveDirection = this.directionTo(context.self.x, context.ball.x);
    const shouldJump = this.shouldJumpToIntercept(context);
    return { moveDirection, shouldJump, shouldShoot: false };
  }

  private buildMoveTowardDecision(fromX: number, toX: number): BotDecision {
    return { moveDirection: this.directionTo(fromX, toX), shouldJump: false, shouldShoot: false };
  }

  private shouldJumpToIntercept(context: BotContext): boolean {
    const selfCenterX = context.self.x + context.self.width / 2;
    const horizontalDistance = Math.abs(context.ball.x - selfCenterX);
    const isBallHighEnough = context.ball.y < context.self.y - GameConfig.BOT_JUMP_INTERCEPT_MIN_HEIGHT;
    return (
      context.self.isGrounded &&
      isBallHighEnough &&
      horizontalDistance <= GameConfig.BOT_JUMP_INTERCEPT_RANGE_X
    );
  }

  private directionTo(fromX: number, toX: number): -1 | 0 | 1 {
    const distance = toX - fromX;
    const deadZone = 4;
    if (Math.abs(distance) <= deadZone) {
      return 0;
    }
    return distance > 0 ? 1 : -1;
  }

  private applyOccasionalError(decision: BotDecision): BotDecision {
    if (Math.random() >= GameConfig.BOT_ERROR_CHANCE || decision.moveDirection === 0) {
      return decision;
    }

    console.log("[Bot] Hesitação / erro de reação.");
    return { ...decision, moveDirection: (decision.moveDirection * -1) as -1 | 1 };
  }
}