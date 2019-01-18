/* eslint-disable no-undef */
/* eslint-disable no-var */
const webpack = require("webpack");
var path = require("path");
var packageJson = require("../package.json");
const isProduction = process.env.NODE_ENV === "production";
const webpackExternals = require("@dnnsoftware/dnn-react-common/WebpackExternals");

module.exports = {
    entry: {
        app: "./src/app.jsx"
    },
    optimization: {
        minimize: isProduction
    },
    output: {
        filename: "[name]-bundle.js",
        path: path.resolve("dist/scripts/bundles")
    },
    resolve: {
        extensions: [".js", ".json", ".jsx"],
        modules: ["node_modules","src"]
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, enforce: "pre", exclude: /node_modules/, loader: "eslint-loader", options: { fix: true } },
            { test: /\.(js|jsx)$/ , exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.(less|css)$/, loader: "style-loader!css-loader!less-loader" },
            { test: /\.(ttf|woff)$/, loader: "url-loader?limit=8192" },
            { test: /\.(gif|png)$/, loader: "url-loader?mimetype=image/png" },
            { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" },
        ]
    },
    externals: webpackExternals,
    plugins: isProduction ? [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(packageJson.version),
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        })
    ] : [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(packageJson.version)
        })
    ]
};