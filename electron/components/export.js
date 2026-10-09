const fs = require('fs');
const os = require('os');
const path = require('path');
const AdmZip = require('adm-zip');
const { app, dialog, BrowserWindow, shell } = require('electron');
const { getUnusedAssets } = require('./file');

const isDev = process.env.IS_DEV === 'true';
const resourcePath = isDev ? path.join(__dirname, '../../public') : process.resourcesPath;
const previewArchive = path.join(resourcePath, 'preview.zip');

const escapeXml = (value) =>
    String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Build the standalone player app (preview build + real copy of the ePoc) in a given folder
 * @param {string} workdir - ePoc working directory
 * @param {string} targetDir - Empty folder receiving the app
 * @returns {{epocId: string, title: string}}
 */
function buildStandaloneEpoc(workdir, targetDir) {
    const content = JSON.parse(fs.readFileSync(path.join(workdir, 'content.json'), 'utf8'));
    const epocId = content.id;
    if (!epocId) throw new Error('Missing ePoc id in content.json');

    new AdmZip(previewArchive).extractAllTo(targetDir, true);

    const epocDir = path.join(targetDir, 'assets', 'demo', 'epocs', epocId);
    fs.mkdirSync(epocDir, { recursive: true });

    const excluded = ['.DS_Store', '__MACOSX', '.git', 'project.json'];
    const unusedAssets = getUnusedAssets(workdir).map((asset) => 'assets/' + asset);
    fs.cpSync(workdir, epocDir, {
        recursive: true,
        dereference: true,
        filter: (src) => {
            const rel = path.relative(workdir, src).replaceAll('\\', '/');
            if (!rel) return true;
            if (excluded.some((e) => rel.split('/').includes(e))) return false;
            return !unusedAssets.includes(rel);
        },
    });

    return { epocId, title: content.title || epocId };
}

/**
 * Inject the epocId redirect before the bundle script and duplicate index.html as 404.html (to make it work in GitLab Pages)
 */
function patchIndexForHtml(siteDir, epocId) {
    const indexPath = path.join(siteDir, 'index.html');
    const redirect =
        `<script>\n` +
        `  if (!location.search.includes('epocId=')) {\n` +
        `    location.replace(location.pathname + '?epocId=${encodeURIComponent(epocId)}' + location.hash);\n` +
        `  }\n` +
        `</script>\n    `;
    const html = fs.readFileSync(indexPath, 'utf8');
    const marker = /<script\s+type="module"/;
    if (!marker.test(html)) throw new Error('Bundle script not found in index.html');

    const patched = html.replace(marker, (m) => redirect + m);
    fs.writeFileSync(indexPath, patched);
    fs.writeFileSync(path.join(siteDir, '404.html'), patched);
}

function buildManifest(epocId, title) {
    const id = escapeXml(epocId);
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${id}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org-${id}">
    <organization identifier="org-${id}">
      <title>${escapeXml(title)}</title>
      <item identifier="item-${id}" identifierref="res-${id}">
        <title>${escapeXml(title)}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res-${id}" type="webcontent" adlcp:scormtype="sco" href="index.html?epocId=${encodeURIComponent(epocId)}">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
`;
}

function makeTempDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'epoc-export-'));
}

/**
 * Export the ePoc as a static site folder (GitLab Pages ready)
 * @param {string} workdir
 * @param {(step: string) => void} [onProgress]
 * @returns {Promise<string|null>} exported folder, null if cancelled
 */
async function exportHtml(workdir, onProgress = () => {}) {
    const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
        properties: ['openDirectory', 'createDirectory'],
    });
    if (result.canceled || !result.filePaths.length) return null;

    const tmpDir = makeTempDir();
    try {
        onProgress('build');
        const { epocId } = buildStandaloneEpoc(workdir, tmpDir);
        patchIndexForHtml(tmpDir, epocId);

        onProgress('write');
        const target = path.join(result.filePaths[0], `${epocId}-html`);
        fs.rmSync(target, { recursive: true, force: true });
        fs.cpSync(tmpDir, target, { recursive: true });
        shell.showItemInFolder(path.join(target, 'index.html'));
        return target;
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
}

/**
 * Export the ePoc as a SCORM package (.zip)
 * @param {string} workdir
 * @param {(step: string) => void} [onProgress]
 * @returns {Promise<string|null>} zip path, null if cancelled
 */
async function exportScorm(workdir, onProgress = () => {}) {
    const content = JSON.parse(fs.readFileSync(path.join(workdir, 'content.json'), 'utf8'));
    const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
        defaultPath: path.join(app.getPath('documents'), `${content.id || 'epoc'}-scorm.zip`),
        filters: [{ name: 'SCORM package', extensions: ['zip'] }],
    });
    if (result.canceled || !result.filePath) return null;

    const tmpDir = makeTempDir();
    try {
        onProgress('build');
        const { epocId, title } = buildStandaloneEpoc(workdir, tmpDir);
        fs.writeFileSync(path.join(tmpDir, 'imsmanifest.xml'), buildManifest(epocId, title));

        onProgress('write');
        const zip = new AdmZip();
        // Empty zipPath => index.html & imsmanifest.xml at the zip root
        zip.addLocalFolder(tmpDir, '');
        await zip.writeZipPromise(result.filePath);
        shell.showItemInFolder(result.filePath);
        return result.filePath;
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
}

module.exports = { exportHtml, exportScorm };
