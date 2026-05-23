// Update the bundled yt-dlp binary on every npm install (postinstall hook).
const { execFileSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const bin = path.join(
  __dirname, '..', 'node_modules', 'youtube-dl-exec', 'bin',
  process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
);

if (!fs.existsSync(bin)) {
  console.log('[yt-dlp] binary not present yet, skipping update.');
  process.exit(0);
}

try {
  console.log('[yt-dlp] updating to latest...');
  execFileSync(bin, ['-U'], { stdio: 'inherit' });
} catch (e) {
  if (e.status !== 1) console.warn('[yt-dlp] update skipped:', e.message);
}
