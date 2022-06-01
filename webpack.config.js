/* eslint-disable no-undef */
const path = require("path");
const dist = path.resolve(__dirname, "dist");

module.exports = {
    mode: "development",
    entry: "./src/main.ts",
    devServer: {
        port: 9000,
        static: {
            serveIndex: true,
            directory: __dirname,
        },
    },
    output: {
        filename: "bundle.js",
        path: dist,
        publicPath: process.env.ASSET_PATH || "/dist/",
    },
    resolve: {
        extensions: [
            ".ts",
            ".js",
            ".vert",
            ".frag",
            ".world",
            ".png",
            ".jpg",
            ".svg",
            ".glb",
            ".gltf",
        ],
    },
    resolveLoader: {
        alias: {
            "texture-loader": path.resolve(
                __dirname,
                "webpack/texture-loader.js"
            ),
            "model-loader": path.resolve(__dirname, "webpack/model-loader.js"),
            "world-loader": path.resolve(__dirname, "webpack/world-loader.js"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(vert|frag)$/i,
                loader: "raw-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.world$/i,
                use: "world-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|svg)$/i,
                loader: "texture-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(glb|gltf)$/i,
                loader: "model-loader",
                exclude: /node_modules/,
            },
        ],
    },
    watchOptions: {
        ignored: /node_modules/,
    },
};
