import path from "path";
import { Configuration } from "webpack";
import "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";

const config: Configuration = {
    target: "web",
    entry: path.resolve(__dirname, "src/index.ts"),
    output: {
        path: path.resolve(__dirname, "../dist/client"),
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: "[name]-[local]--[hash:base64:5]",
                            },
                        },
                    },
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.ts$/,
                use: ["ts-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.png$/,
                use: ["file-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "assets/index.html"),
            favicon: path.resolve(__dirname, "assets/favicon.png"),
        }),
        new MiniCssExtractPlugin(),
        new CopyPlugin([
            { from: path.resolve(__dirname, "assets/public"), to: path.resolve(__dirname, "../dist/client/assets") }
        ]),
    ],
    devtool: "cheap-eval-source-map",
};

export default config;
