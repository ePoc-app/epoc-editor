import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
export default {
    artifactName: '${name}_v${version}_${os}_${arch}.${ext}',
    appId: 'fr.inria.epoc-editor',
    productName: 'ePoc Editor',
    copyright: 'Copyright © 2022 ${author}',
    buildNumber: execSync('git rev-parse --short HEAD').toString().trim(),
    publish: {
        provider: 'github',
        repo: 'epoc-editor',
        owner: 'ePoc-app',
        releaseType: 'draft',
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
        allowToChangeInstallationDirectory: true,
    },
    files: ['dist/**/*', 'electron/**/*'],
    directories: {
        buildResources: 'assets',
        output: 'dist_electron',
    },
    extraMetadata: {
        // Get the most recent git tag otherwise use the version from package.json
        version: tcDefault(() => {
            execSync('git describe --tags --abbrev=0', { stdio: [] }).toString().trim();
        }, packageJson.version),
    },
    extraResources: [
        { from: 'public/preview.zip', to: 'preview.zip' },
        { from: 'i18n', to: 'i18n' },
    ],
    beforePack: async (context) => {
        // Write an appInfo file to be used in prod
        const appInfo = {
            description: context.packager.appInfo.description,
            version: context.packager.appInfo.version,
            buildNumber: context.packager.appInfo.buildNumber,
            buildVersion: context.packager.appInfo.buildVersion,
            productName: context.packager.appInfo.productName,
        };
        writeFileSync('dist/appInfo.json', JSON.stringify(appInfo, null, 2));
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
            icon: 'assets/icon-mobile.png',
        },
        {
            ext: 'epocproject',
            name: 'ePoc Project',
            description: 'ePoc project content package',
            mimeType: 'application/zip',
            role: 'Editor',
            isPackage: false,
            rank: 'Default',
        },
    ],
    // Add support for ES modules
    nodeModulesPath: ['../../node_modules', '../node_modules'],
    asar: true,
    asarUnpack: ['node_modules/**/*.node'],
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
