/* eslint-disable no-undef */
const path = require("path");

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
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
    },
    resolve: {
        extensions: [".ts", ".js", ".vert", ".frag"],
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
            },
        ],
    },
    watchOptions: {
        ignored: /node_modules/,
    },
};
