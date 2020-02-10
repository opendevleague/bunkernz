import { fork, ChildProcess } from "child_process";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import buildConfig from "./config.json";
import serverConfig from "../server/webpack.config";
import clientConfig from "../client/webpack.config";

const clientDevServerConfig = clientConfig.devServer || {};

const server = webpack({
    mode: "development",
    ...serverConfig,
});

server.hooks.watchRun.tap("notice", () => {
    console.log("Rebuilding server...");
});
server.hooks.afterEmit.tap("notice", () => {
    console.log("Server ready.");
});

let cp: ChildProcess;
server.watch({}, err => {
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
});

client.hooks.watchRun.tap("notice", () => {
    console.log("Rebuilding client...");
});

client.hooks.afterEmit.tap("notice", () => {
    console.log("Client ready.");
});

const clientWatch = new WebpackDevServer(client, {
    ...clientDevServerConfig,
    noInfo: true,
    stats: {
        children: false,
        modules: false,
    },
});

const { host, port } = buildConfig.client.devServer;
clientWatch.listen(port, host, () => {
    console.log(`Client will be available at http://${host}:${port}`);
});
