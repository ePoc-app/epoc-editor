# ePoc Editor v2

## Setup
```bash
# Install dependencies
npm install

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

### Setup preview

1. Create a `.env` containing the Gitlab url and access token to fetch the preview files : `GITLAB_URL`, `GITLAB_TOKEN`
2. Run `npm run updatePreview`
3. Build or run the app in dev using above scripts