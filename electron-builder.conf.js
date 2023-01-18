const cp = require('child_process');
const packageJson = require('./package.json');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
    appId: "fr.inria.epoc-editor",
    productName: "ePoc Editor",
    copyright: "Copyright © 2022 ${author}",
    buildVersion: cp.execSync('git rev-parse --short HEAD').toString().trim(),
    mac: {
        category: "public.app-category.utilities"
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true
    },
    files: [
        "dist/**/*",
        "electron/**/*"
    ],
    directories: {
        buildResources: "assets",
        output: "dist_electron"
    },
    extraMetadata: {
        // Get the most recent git tag otherwise use the version from package.json
      version: tcDefault(() => { cp.execSync('git describe --tags --abbrev=0', { stdio: [] }).toString().trim() }, packageJson.version)
    }
}

/**
 * Try catch the execution of a function and return the default value in case of errors
 * @param func the function to be catched
 * @param def the default value in case of an error
 * @returns {*}
 */
function tcDefault(func, def) {
    try {
        return func();
    } catch {
        return def;
    }
}