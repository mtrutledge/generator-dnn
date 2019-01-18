/* eslint-disable no-undef */
/* eslint-disable no-var */
const webpack = require("webpack");
var path = require("path");
var packageJson = require("../package.json");
const isProduction = process.env.NODE_ENV === "production";
const webpackExternals = require("@dnnsoftware/dnn-react-common/WebpackExternals");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
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


if(isProduction) {
    module.exports.plugins.push(
        new CopyWebpackPlugin([
            { from: "./<%= moduleName %>.dnn", to: "../../<%= moduleName %>.dnn" },
            { from: "./src/Resources", to: "../../Resources", ignore: [ "*.scss" ] }
        ]),
        new HtmlWebpackPlugin({
            inject: false,
            title: "License",
            template: path.resolve(__dirname, "./src/_templates/Markdown.html"),
            filename: "../../License.txt",
            bodyHTML: marked(fs.readFileSync( path.resolve(__dirname, "./src/License.md"), "utf8")) 
        }),
        new HtmlWebpackPlugin({
            inject: false,
            title: "Release Notes",
            template: path.resolve(__dirname, "./src/_templates/Markdown.html"),
            filename: "../../ReleaseNotes.txt",
            bodyHTML: marked(fs.readFileSync( path.resolve(__dirname, "./src/ReleaseNotes.md"), "utf8")) 
        })
    );
}