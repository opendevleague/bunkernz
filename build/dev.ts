import process from "process";
import { fork, ChildProcess } from "child_process";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import serverConfig from "../server/webpack.config";
import clientConfig from "../client/webpack.config";

const clientDevServerConfig = clientConfig.devServer || {};
const clientPort: number =
  (process.env.CLIENT_PORT ? +process.env.CLIENT_PORT : 0) ||
  clientDevServerConfig.port ||
  9000;
const serverPort: number =
  (process.env.SERVER_PORT ? +process.env.SERVER_PORT : 0) ||
  clientDevServerConfig.port ||
  9001;

const server = webpack({
  mode: "development",
  ...serverConfig,
  plugins: [
    ...clientConfig.plugins,
    new webpack.DefinePlugin({
      SERVER_PORT: serverPort,
    }),
  ],
});

server.hooks.watchRun.tap("notice", () => {
  console.log("Rebuilding server...");
});
server.hooks.afterEmit.tap("notice", () => {
  console.log("Server ready.");
});

let cp: ChildProcess;
const serverWatch = server.watch({}, (err, stats) => {
  if (err) {
    console.log(err);
    return;
  }

  if (cp) cp.kill();
  cp = fork("./dist/server/main.js");
});

const client = webpack({
  mode: "development",
  ...clientConfig,
  plugins: [
    ...clientConfig.plugins,
    new webpack.DefinePlugin({
      SERVER_PORT: serverPort,
    }),
  ],
});

const clientWatch = new WebpackDevServer(client, {
  ...clientDevServerConfig,
  noInfo: true,
  before: (app, devServer, compiler) => {
    compiler.hooks.watchRun.tap("notice", () => {
      console.log("Rebuilding client...");
    });
    compiler.hooks.afterEmit.tap("notice", () => {
      console.log("Client ready.");
    });
  },
  stats: {
    children: false,
    modules: false,
  },
});

clientWatch.listen(clientPort, "0.0.0.0", () => {
  console.log(`Client will be available at http://localhost:${clientPort}`);
});
