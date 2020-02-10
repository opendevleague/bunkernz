import { Server } from "ws";
import buildConfig from "../../build/config.json";

const wss = new Server({
  host: buildConfig.server.listenHost,
  port: buildConfig.server.listenPort,
});

wss.on("connection", () => {
  console.log("Client connected");
});
