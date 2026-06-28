export type QueueType = "normal" | "ranked";
export type GameMode = "1v1" | "5v5";
export type QueueUiState = "idle" | "queueing";

export interface Friend {
  readonly id: string;
  readonly name: string;
  readonly avatarInitial: string;
  readonly statusLabel: string;
}

export interface FriendRequest {
  readonly id: string;
  readonly name: string;
  readonly avatarInitial: string;
}

export interface Invite {
  readonly id: string;
  readonly fromName: string;
  readonly gameMode: GameMode;
}