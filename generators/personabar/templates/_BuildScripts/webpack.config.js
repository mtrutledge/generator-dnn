var webpack = require('webpack');
var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');
const webpackExternals = require("dnn-webpack-externals");

var moduleCompanyName = "<%= namespace %>"; 
var moduleProjName = "<%= moduleName %>"; 

module.exports = {
    devtool: 'eval',
    // This will be our app's entry point (webpack will look for it in the 'src' directory due to the modulesDirectory setting below). Feel free to change as desired.
    entry: {
        app: 'app.tsx'
    },
    // Output the bundled JS to Resources/js/app.js
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve('_PersonaBar/scripts/bundles')
    },
    resolve: {
        // Look for modules in .ts(x) files first, then .js(x)
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        // Add 'src' to our modulesDirectories, as all our app code will live in there, so Webpack should look in there for modules
        modules: ['src', 'node_modules'],
    },
    module: {
        loaders: [
          // .ts(x) files should first pass through the Typescript loader, and then through babel
          { test: /\.tsx?$/, loaders: ['babel-loader', 'ts-loader'] }
        ]
    },
    externals: webpackExternals,
    plugins: [
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new WebpackNotifierPlugin({ alwaysNotify: true }), // Set up the notifier plugin - you can remove this (or set alwaysNotify false) if desired
    ]
};