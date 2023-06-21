const cp = require('child_process');
require('dotenv').config();

module.exports = {
  packagerConfig: {
    appBundleId: 'fr.inria.epoc-editor',
    appCopyright: 'Copyright © 2022 Inria Learning Lab',
    name: 'ePoc Editor',
    icon: 'assets/icon',
    buildVersion: cp.execSync('git rev-parse --short HEAD').toString().trim(),
    osxSign: {},
    osxNotarize: {
      tool: 'legacy',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID, // notary tool (xcode 13+)
      ascProvider: process.env.APPLE_TEAM_SHORTNAME // legacy tool
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken: process.env.GITHUB_TOKEN,
        repository: {
          owner: 'inrialearninglab',
          name: 'epoc-editor'
        },
        prerelease: true
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'electron/electron.js',
            config: 'vite.main.config.mjs',
          },
          {
            entry: 'electron/preload.js',
            config: 'vite.preload.config.mjs',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
  ],
};
