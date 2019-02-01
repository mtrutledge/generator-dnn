/* eslint-disable no-undef */
/* eslint-disable no-var */
const webpack = require("webpack");
var path = require("path");
var packageJson = require("../package.json");
let isProduction = true;
const webpackExternals = require("@dnnsoftware/dnn-react-common/WebpackExternals");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const marked = require("marked");
const fs = require("fs");

module.exports = (env, argv) => {
    isProduction = argv.mode === "production";

    return {
        devtool: isProduction ? false : "inline-source-map",
        mode: isProduction ? "production" : "development",
        entry: {
            app: "./src/app.jsx"
        },
        optimization: {
            minimize: isProduction
        },
        output: {
            filename: "[name]-bundle.js",
            path: path.resolve("dist/Resources/scripts/")
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
            }),
            new CopyWebpackPlugin([
                { from: "./<%= moduleName %>.dnn", to: "../../<%= moduleName %>.dnn" },
                { from: "./App_LocalResources", to: "../../App_LocalResources" },
                { from: "./src/Resources", to: "../../Resources", ignore: [ "*.scss" ] },
                { from: "./src/scripts", to: "../../scripts" },
                { from: "./src/css", to: "../../css" },
                { from: "./bin/*.*", to: "../../", ignore: [ "Dnn*", "DotNetNuke*", "System*", "Microsoft*", "Newtonsoft*", "*.deps.json" ] },
                { from: "./Providers/**/*.*", to: "../../" }
            ]),
            new HtmlWebpackPlugin({
                inject: false,
                environment: process.env.NODE_ENV,
                template: path.resolve("./src/<%= moduleName %>.html"),
                filename: "../../<%= moduleName %>.html"
            }),
            new HtmlWebpackPlugin({
                inject: false,
                title: "License",
                template: path.resolve("./src/_templates/Markdown.html"),
                filename: "../../License.txt",
                bodyHTML: marked(fs.readFileSync( path.resolve("./src/License.md"), "utf8")) 
            }),
            new HtmlWebpackPlugin({
                inject: false,
                title: "Release Notes",
                template: path.resolve("./src/_templates/Markdown.html"),
                filename: "../../ReleaseNotes.txt",
                bodyHTML: marked(fs.readFileSync( path.resolve("./src/ReleaseNotes.md"), "utf8")) 
            })
        ] : [
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(packageJson.version)
            })
        ]
    };
}