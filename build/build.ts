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
    new ProgressPlugin((percent, msg) => {
        process.stdout.clearLine(0);
        console.log(`${percent}%`, msg);
    }),
);

compiler.run((err, stats) => {
    if (err) {
        console.log("Build failed");
        return;
    }

    console.log("Build finished");
});
