import { App } from "./app/App";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/components.css";
import "./styles/login.css";
import "./styles/register.css";
import "./styles/menu.css";
import "./styles/singleplayer.css";
import "./styles/court.css";
import "./styles/hud.css";
import "./styles/lobby.css";
import "./styles/lobby-sidebar.css";

function bootstrap(): void {
  const rootElement = document.getElementById("app");
  if (rootElement === null) {
    throw new Error("Elemento #app não encontrado no documento.");
  }

  const app = new App(rootElement);
  app.start();
}

document.addEventListener("DOMContentLoaded", bootstrap);

console.log("INDEX EXECUTOU");