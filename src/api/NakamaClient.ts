import { Client } from "@heroiclabs/nakama-js";

const NAKAMA_SERVER_KEY = "defaultkey";
const NAKAMA_HOST = "127.0.0.1";
const NAKAMA_PORT = "7350";
const NAKAMA_USE_SSL = false;

export class NakamaClient {
  private static instance: NakamaClient | null = null;
  private readonly client: Client;

  private constructor() {
    console.log("[NakamaClient] Inicializando cliente Nakama...");
    this.client = new Client(NAKAMA_SERVER_KEY, NAKAMA_HOST, NAKAMA_PORT, NAKAMA_USE_SSL);
    console.log("[NakamaClient] Cliente Nakama inicializado.");
  }

  public static getInstance(): NakamaClient {
    if (NakamaClient.instance === null) {
      NakamaClient.instance = new NakamaClient();
    }
    return NakamaClient.instance;
  }

  public getClient(): Client {
    return this.client;
  }
}