/* eslint-disable no-undef */
/* eslint-disable no-var */
const webpack = require("webpack");
var path = require("path");
var packageJson = require("../package.json");
let isProduction = true;
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
            app: "./src/app.tsx",
            edit: "./src/edit.tsx",
            settings: "./src/settings.tsx"
        },
        optimization: {
            minimize: isProduction
        },
        output: {
            filename: "[name]-bundle.js",
            path: path.resolve("dist/Resources/scripts/")
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            modules: ["node_modules","src"]
        },
        module: {
            rules: [
                { test: /\.(ts|tsx)$/, enforce: "pre", exclude: /node_modules/, loaders: "tslint-loader" },
                // .ts(x) files should first pass through the Typescript loader, and then through babel
                { test: /\.(ts|tsx)?$/, exclude: /node_modules/, loaders: ['babel-loader', 'ts-loader'] },
                { test: /\.(sass|scss)$/, loaders: "style-loader!css-loader!sass-loader" },
                { test: /\.(ttf|woff)$/, loaders: "url-loader?limit=8192" },
                { test: /\.(gif|png)$/, loaders: "url-loader?mimetype=image/png" },
                { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loaders: "url-loader?mimetype=application/font-woff" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loaders: "file-loader?name=[name].[ext]" },
            ]
        },
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
                { from: "./bin/*.*", to: "../../", ignore: [ "Dnn*", "DotNetNuke*", "System*", "Microsoft*", "Newtonsoft*", "*.deps.json" ] },
                { from: "./Providers/**/*.*", to: "../../" }
            ]),
            new HtmlWebpackPlugin({
                inject: false,
                environment: process.env.NODE_ENV,
                template: path.resolve("./src/View.html"),
                filename: "../../View.html"
            }),
            new HtmlWebpackPlugin({
                inject: false,
                environment: process.env.NODE_ENV,
                template: path.resolve("./src/Edit.html"),
                filename: "../../Edit.html"
            }),
            new HtmlWebpackPlugin({
                inject: false,
                environment: process.env.NODE_ENV,
                template: path.resolve("./src/Settings.html"),
                filename: "../../Settings.html"
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
            }),
            new CopyWebpackPlugin([
                { from: "./<%= moduleName %>.dnn", to: "../../<%= moduleName %>.dnn" },
                { from: "./App_LocalResources", to: "../../App_LocalResources" },
                { from: "./src/Resources", to: "../../Resources", ignore: [ "*.scss" ] },
                { from: "./bin/*.*", to: "../../", ignore: [ "Dnn*", "DotNetNuke*", "System*", "Microsoft*", "Newtonsoft*", "*.deps.json" ] },
                { from: "./Providers/**/*.*", to: "../../" }
            ]),
            new HtmlWebpackPlugin({
                inject: false,
                environment: process.env.NODE_ENV,
                template: path.resolve("./src/View.html"),
                filename: "../../View.html"
            }),
            new HtmlWebpackPlugin({
                inject: false,
                environment: process.env.NODE_ENV,
                template: path.resolve("./src/Edit.html"),
                filename: "../../Edit.html"
            }),
            new HtmlWebpackPlugin({
                inject: false,
                environment: process.env.NODE_ENV,
                template: path.resolve("./src/Settings.html"),
                filename: "../../Settings.html"
            })
        ]
    };
}