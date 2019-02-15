/* eslint-disable no-console */
const pkg = require("../package.json");
const path = require("path");
let browserSync = require("browser-sync").create();

browserSync.init({
    open: false,
    proxy: pkg.dnn.localhost,
    files: ["dist/**"],
    serveStatic: ["dist"],
    rewriteRules: [
        {
            match: new RegExp("/DesktopModules/<%= namespace %>/<%= moduleName %>/Resources/scripts/app-bundle.js"),
            fn: function () {
                return "/Resources/scripts/app-bundle.js";
            }
        },
        {
            match: new RegExp("/DesktopModules/<%= namespace %>/<%= moduleName %>/Resources/scripts/edit-bundle.js"),
            fn: function () {
                return "/Resources/scripts/edit-bundle.js";
            }
        },
        {
            match: new RegExp("/DesktopModules/<%= namespace %>/<%= moduleName %>/Resources/scripts/settings-bundle.js"),
            fn: function () {
                return "/Resources/scripts/settings-bundle.js";
            }
        }
    ]
});