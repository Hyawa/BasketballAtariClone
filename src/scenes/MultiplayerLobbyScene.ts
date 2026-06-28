import { Screen, Router } from "../app/Router";
import { LobbyHeader } from "../ui/components/MultiplayerLobby/LobbyHeader";
import { QueueSelector } from "../ui/components/MultiplayerLobby/QueueSelector";
import { GameModeSelector } from "../ui/components/MultiplayerLobby/GameModeSelector";
import { QueueStatus } from "../ui/components/MultiplayerLobby/QueueStatus";
import { FriendSidebar } from "../ui/components/MultiplayerLobby/FriendSidebar";
import { QueueType, GameMode } from "../types/Lobby";
import { onlineFriends, offlineFriends } from "../mocks/FriendsMock";
import { friendRequests } from "../mocks/RequestsMock";
import { invites } from "../mocks/InvitesMock";

const MODE_DESCRIPTIONS: Record<GameMode, string> = {
  "1v1": "Duelo direto, sem ajuda de equipe. Apenas você e o adversário na quadra.",
  "5v5": "Partida em equipe completa, com estratégia coletiva e rotações.",
};

export class MultiplayerLobbyScene implements Screen {
  private readonly router: Router;
  private root: HTMLElement | null = null;
  private queueStatus: QueueStatus | null = null;
  private selectedQueueType: QueueType = "normal";
  private selectedGameMode: GameMode = "1v1";

  public constructor(router: Router) {
    this.router = router;
  }

  public mount(container: HTMLElement): void {
    console.log("[MultiplayerLobbyScene] Montando lobby (mock data, sem Nakama).");

    this.root = document.createElement("div");
    this.root.className = "screen screen--multiplayer-lobby";

    const mainArea = document.createElement("div");
    mainArea.className = "lobby-main";

    const header = new LobbyHeader(this.router);

    const queueSelector = new QueueSelector({
      initialValue: this.selectedQueueType,
      onChange: (value) => this.handleQueueTypeChange(value),
    });

    const gameModeSelector = new GameModeSelector({
      initialValue: this.selectedGameMode,
      onChange: (value) => this.handleGameModeChange(value),
    });

    this.queueStatus = new QueueStatus();
    this.queueStatus.setDescription(MODE_DESCRIPTIONS[this.selectedGameMode]);

    mainArea.appendChild(header.render());
    mainArea.appendChild(queueSelector.render());
    mainArea.appendChild(gameModeSelector.render());
    mainArea.appendChild(this.queueStatus.render());

    const sidebar = new FriendSidebar({
      onlineFriends,
      offlineFriends,
      friendRequests,
      invites,
    });

    this.root.appendChild(mainArea);
    this.root.appendChild(sidebar.render());
    container.appendChild(this.root);
  }

  public unmount(): void {
    this.queueStatus?.dispose();
    this.queueStatus = null;
    this.root?.remove();
    this.root = null;
  }

  private handleQueueTypeChange(value: QueueType): void {
    this.selectedQueueType = value;
  }

  private handleGameModeChange(value: GameMode): void {
    this.selectedGameMode = value;
    this.queueStatus?.setDescription(MODE_DESCRIPTIONS[value]);
  }
}