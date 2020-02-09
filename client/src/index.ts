import "./index.scss";

const app: HTMLElement = document.getElementById("app") as HTMLElement;

const title = document.createElement("h1");
title.innerHTML = "COMMUNITY GAME!!!";

app.append(title);
console.log("YAAY");

new WebSocket(`ws://localhost:${SERVER_PORT}`);
