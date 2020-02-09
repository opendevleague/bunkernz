import { Server } from "ws";

const wss = new Server({
  host: "0.0.0.0",
  port: SERVER_PORT,
});

wss.on("connection", () => {
  console.log("Client connected");
});
