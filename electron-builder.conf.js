const cp = require('child_process');
const fs = require('fs');
const packageJson = require('./package.json');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
    artifactName: '${name}_v${version}_'+new Date().toISOString().split('T')[0]+'.${ext}',
    appId: 'fr.inria.epoc-editor',
    productName: 'ePoc Editor',
    copyright: 'Copyright © 2022 ${author}',
    buildNumber: cp.execSync('git rev-parse --short HEAD').toString().trim(),
    mac: {
        category: 'public.app-category.utilities'
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true
    },
    files: [
        'dist/**/*',
        'electron/**/*'
    ],
    directories: {
        buildResources: 'assets',
        output: 'dist_electron'
    },
    extraMetadata: {
        // Get the most recent git tag otherwise use the version from package.json
        version: tcDefault(() => { cp.execSync('git describe --tags --abbrev=0', { stdio: [] }).toString().trim(); }, packageJson.version)
    },
    extraResources: [
        {from: 'public/preview.zip', to: 'preview.zip'}
    ],
    beforePack: async (context) => {
        // Write an appInfo file to be used in prod
        const appInfo = {
            description: context.packager.appInfo.description,
            version: context.packager.appInfo.version,
            buildNumber: context.packager.appInfo.buildNumber,
            buildVersion: context.packager.appInfo.buildVersion,
            productName: context.packager.appInfo.productName
        };
        fs.writeFileSync('dist/appInfo.json', JSON.stringify(appInfo, null, 2));
    },
    fileAssociations: {
        ext: 'epoc',
        name: 'ePoc Project',
        description: 'ePoc project content package',
        mimeType: 'application/zip',
        role: 'Editor',
        isPackage: false,
        rank: 'Default'
    }
};

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