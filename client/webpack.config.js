const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devServerConf = {
    contentBase: 'src',
    compress: true,
    port: 3000,
    open: true,
    watchContentBase: true,
    hot: true,
    quiet: true,
    clientLogLevel: 'silent'
};

const rules = [
    {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: "css-loader",
                options: {
                    importLoaders: 1,
                    modules: {
                        localIdentName: "[name]-[local]--[hash:base64:5]"
                    }
                }
            },
            "postcss-loader",
            "sass-loader"
        ]
    },
    {
        test: /\.ts(x)?$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/
    },
    {
        test: /\.(svg|png|jpg|ico)$/,
        use: {
            loader: "file-loader",
            options: { outputPath: "assets", name: "[folder][name].[ext]" }
        }
    }
];


const plugins = [
    new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
    }),
    new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico"
    }),
    new MiniCssExtractPlugin(),
    // new FriendlyErrorsWebpackPlugin(),
];

const config = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: rules
    },
    plugins: plugins,
    devServer: devServerConf,
    resolve: {
        extensions: [
            ".tsx",
            ".ts",
            ".js"
        ]
    },
    devtool: "source-map",
};

module.exports = config;