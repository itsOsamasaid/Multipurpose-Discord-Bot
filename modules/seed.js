// First-run data seed.
//
// Container hosts (Railway, etc.) start each deploy with an empty filesystem,
// and a fresh `git clone` has no config.json. This recreates any missing
// database/ files before the bot loads its config, so nothing crashes on a
// cold start. Once the files exist it's a no-op, so it's safe to run always.

const fs   = require('fs');
const path = require('path');

const dbDir       = path.join(__dirname, '..', 'database');
const configPath  = path.join(dbDir, 'config.json');
// The template lives at the repo root, NOT inside database/. A host volume
// mounted at database/ would hide it, leaving the seed nothing to copy from.
const examplePath = path.join(__dirname, '..', 'config.example.json');

// Every JSON store the bot reads from / writes to. All start as an empty {}.
const dataFiles = [
  'adblock', 'adhan', 'autorole', 'games', 'guild', 'iwlc', 'last', 'log',
  'names', 'tempv', 'text', 'userdata', 'voice', 'vonline', 'warnings', 'wlc'
];

module.exports = function seed() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  // config.json — copy it from the committed template if it doesn't exist.
  let createdConfig = false;
  if (!fs.existsSync(configPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, configPath);
    createdConfig = true;
  }

  // Data stores — create an empty {} for any that are missing.
  for (const name of dataFiles) {
    const file = path.join(dbDir, `${name}.json`);
    if (!fs.existsSync(file)) fs.writeFileSync(file, '{}\n');
  }

  return { createdConfig };
};
