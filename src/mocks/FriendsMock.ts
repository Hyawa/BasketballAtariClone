import { Friend } from "../types/Lobby";

export const onlineFriends: ReadonlyArray<Friend> = [
  { id: "f1", name: "Rafa_BR", avatarInitial: "R", statusLabel: "Online" },
  { id: "f2", name: "Juliana_K", avatarInitial: "J", statusLabel: "Online" },
  { id: "f3", name: "Marcos99", avatarInitial: "M", statusLabel: "Em partida" },
];

export const offlineFriends: ReadonlyArray<Friend> = [
  { id: "f4", name: "Pedro_Hoop", avatarInitial: "P", statusLabel: "Offline" },
  { id: "f5", name: "Bia_Court", avatarInitial: "B", statusLabel: "Offline" },
];