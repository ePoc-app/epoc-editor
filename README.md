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

### Setup code signing

Add to `.env` (or download from the snippets) containing the Apple developer account infos : `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `APPLE_SIGNING_ID`, `APPLE_ASC=Z2P73A9B8S`

### Release

Code-signing and publication on [GitHub](https://github.com/inrialearninglab/epoc-editor/releases) is automated but you 
need to manually sign the windows executable : Ask the Inria DSI SOC team to sign it, then reupload it to the Github release