const cp = require('child_process');
const fs = require('fs');
const packageJson = require('./package.json');
require('dotenv').config();
const { notarize } = require('@electron/notarize');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
    artifactName: '${name}_v${version}_${os}_${arch}.${ext}',
    appId: 'fr.inria.epoc-editor',
    productName: 'ePoc Editor',
    copyright: 'Copyright © 2022 ${author}',
    buildNumber: cp.execSync('git rev-parse --short HEAD').toString().trim(),
    publish: {
        provider: 'github',
        repo: 'epoc-editor',
        owner: 'inrialearninglab',
        releaseType: 'draft'
    },
    mac: {
        category: 'public.app-category.utilities',
        identity: process.env.APPLE_SIGNING_ID,
        hardenedRuntime: true,
        gatekeeperAssess: false,
        entitlements: './entitlements.plist',
        entitlementsInherit: './entitlements.plist',
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
    fileAssociations: [
        {
            ext: 'epoc',
            name: 'ePoc',
            description: 'ePoc publication',
            mimeType: 'application/zip',
            role: 'Mobile Application',
            isPackage: false,
            rank: 'Default',
            icon: 'assets/icon-mobile.png'
        },
        {
            ext: 'epocproject',
            name: 'ePoc Project',
            description: 'ePoc project content package',
            mimeType: 'application/zip',
            role: 'Editor',
            isPackage: false,
            rank: 'Default',
        }
    ],
    afterSign: async (context) => {
        const { electronPlatformName, appOutDir } = context;
        if (electronPlatformName !== 'darwin' || process.env.NO_NOTARIZE) {
            return;
        }

        const appName = context.packager.appInfo.productFilename;

        try {
            return await notarize({
                tool: 'notarytool',
                appBundleId: 'fr.inria.epoc-editor',
                appPath: `${appOutDir}/${appName}.app`,
                appleId: process.env.APPLE_ID,
                appleIdPassword: process.env.APPLE_PASSWORD,
                teamId: process.env.APPLE_TEAM_ID,
                ascProvider: process.env.APPLE_ASC
            });
        } catch (e) {
            console.log('Could not notarize');
        }
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
