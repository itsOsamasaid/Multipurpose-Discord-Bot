// Recreate any missing database/ files before the config is loaded.

const fs   = require('fs');
const path = require('path');

const dbDir       = path.join(__dirname, '..', 'database');
const configPath  = path.join(dbDir, 'config.json');
// Template lives at repo root — a volume mounted at database/ would hide it.
const examplePath = path.join(__dirname, '..', 'config.example.json');

const dataFiles = [
  'adblock', 'adhan', 'autorole', 'games', 'guild', 'iwlc', 'last', 'log',
  'names', 'tempv', 'text', 'userdata', 'voice', 'vonline', 'warnings', 'wlc'
];

module.exports = function seed() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  let createdConfig = false;
  if (!fs.existsSync(configPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, configPath);
    createdConfig = true;
  }

  for (const name of dataFiles) {
    const file = path.join(dbDir, `${name}.json`);
    if (!fs.existsSync(file)) fs.writeFileSync(file, '{}\n');
  }

  return { createdConfig };
};
