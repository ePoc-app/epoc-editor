# ePoc Editor v2

## Setup


### Prerequisites

- Node v16+: https://nodejs.org/en
- Ionic cli: `npm install -g @ionic/cli`
- Cocoapods: `sudo gem install cocoapods`
- Dependencies: `npm i`

### Setup preview

1. Create (or download from the snippets) a `.env` containing the Gitlab url and access token to fetch the preview files : `GITLAB_URL`, `GITLAB_TOKEN`
2. Run `npm run updatePreview`
3. Build or run the app in dev using above scripts

### Development

```bash
# Run in dev mode
npm run dev

# Build electron app
npm run build

# Run unit test
npm run test

# Run end to end test
run run wdio

# Run linter
npm run lint
```

### Release

Releases are built by the GitLab CI and published as a **draft** on [GitHub](https://github.com/ePoc-app/epoc-editor/releases):

1. Run the manual `release` job: it builds the app for macOS, Windows and Linux and publishes the draft release.
   The macOS and Windows executables are **not signed** at this point.
2. The `trigger_signing` job then starts the pipeline of the
   [epoc-sign-code](https://gitlab-int.inria.fr/learninglab/epoc-sign-code) project (Inria internal GitLab).
   It downloads the executables from the draft release, signs them (and notarizes the macOS app) with the Inria code
   signing service, and replaces them in the draft release along with the auto-update metadata (`latest.yml`, `latest-mac.yml`).
3. Once that pipeline succeeds, check the draft release and publish it.

No signing certificate or Apple account is needed locally or in this project's CI: local builds produce unsigned apps.
See the epoc-sign-code README for details and troubleshooting.