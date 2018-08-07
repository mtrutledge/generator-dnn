const webpack = require("webpack");
var path = require('path');
var packageJson = require('../package.json')
const isProduction = process.env.NODE_ENV === "production";
const languages = {
    "en": null
};

const webpackExternals = require("dnn-webpack-externals");

module.exports = {
    entry: {
        app: "./src/app.jsx"
    },
    output: {
        filename: "[name]-bundle.js",
        path: path.resolve('scripts/bundles')
    },
    resolve: {
        extensions: ["", ".js", ".json", ".jsx"],
        modules: ['src']
    },
    module: {
        loaders: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ["react-hot-loader", "babel-loader"] },
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
            { test: /\.(ttf|woff)$/, loader: "url-loader?limit=8192" }
        ],
        preLoaders: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: "eslint-loader" }
        ]
    },
	externals: webpackExternals,
    plugins: isProduction ? [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin(),
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