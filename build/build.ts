import process from "process";
import webpack, { ProgressPlugin } from "webpack";
import "webpack-dev-server";

import clientConfig from "../client/webpack.config";
import serverConfig from "../server/webpack.config";

const compiler = webpack([
    {
        mode: "production",
        ...serverConfig,
    },
    {
        mode: "production",
        ...clientConfig,
    },
]);

compiler.apply(
    new ProgressPlugin((progress, msg) => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`${Math.round(progress * 100)}% ${msg}`, "utf8");
    }),
);

compiler.run((err, stats) => {
    if (err) {
        console.log("Build failed");
        return;
    }

    console.log("Build finished");
});
