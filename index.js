require('dotenv').config();

// Log async errors instead of crashing the process.
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});

const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType
} = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const fs    = require('fs');
const path  = require('path');
const chalk = require('chalk');

// Register the bundled Cairo font for canvas cards.
const Canvas  = require('canvas');
const fontDir = path.join(__dirname, 'storage', 'fonts');
Canvas.registerFont(path.join(fontDir, 'Cairo-Regular.ttf'), { family: 'Cairo' });
Canvas.registerFont(path.join(fontDir, 'Cairo-Bold.ttf'),    { family: 'Cairo', weight: 'bold' });
Canvas.registerFont(path.join(fontDir, 'Cairo-Light.ttf'),   { family: 'Cairo', weight: '300' });

// Create any missing database/ files before loading config.
const { createdConfig } = require('./modules/seed')();

const config = require('./database/config.json');
const brand  = config.branding;

// Env vars override config.json. .trim() strips stray whitespace from pasted values.
config.token    = (process.env.TOKEN    || config.token    || '').trim();
config.clientid = (process.env.CLIENTID || config.clientid || '').trim();
config.owner    = (process.env.OWNER    || config.owner    || '').trim();

// Bail early with a clear message if no real token.
if (!config.token || config.token === 'your_bot_token') {
  console.error(chalk.red(createdConfig
    ? '[Setup] Created database/config.json from the template.\n' +
      '        Add your bot token to it (or set the TOKEN env var), then start again.'
    : '[Setup] No bot token found.\n' +
      '        Set "token" in database/config.json, or provide the TOKEN env var.'));
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

client.config   = config;
client.commands = new Collection();
client.logger   = require('./util/logger');
client.tools    = require('./modules/functions');

function printBanner() {
  console.log('\n' + chalk.bold.cyan('═'.repeat(50)));
  console.log(chalk.bold.cyan(`  ${brand.name} Bot  v${brand.version}`));
  console.log(chalk.cyan('═'.repeat(50)));
  console.log(chalk.green('  Prefix  : ') + config.prefix);
  console.log(chalk.green('  Footer  : ') + brand.footer);
  console.log(chalk.green('  Colors  : ') + Object.entries(brand.colors).map(([k, v]) => `${k}(#${v})`).join(' | '));
  console.log(chalk.cyan('═'.repeat(50)) + '\n');
}

// Load commands from commands/ subfolders
function loadCommands() {
  console.log(chalk.cyan('[Commands] Loading...'));
  let total = 0;
  for (const category of config.commands) {
    const categoryPath = path.join(__dirname, 'commands', category);
    if (!fs.existsSync(categoryPath)) {
      console.warn(chalk.yellow(`[Commands] Folder not found, skipping: ${category}`));
      continue;
    }
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
    let loaded = 0;
    for (const file of files) {
      try {
        const command = require(path.join(categoryPath, file));
        if (!command.help?.name) {
          console.warn(chalk.yellow(`[Commands] Skipping ${category}/${file} — missing exports.help.name`));
          continue;
        }
        client.commands.set(command.help.name.toLowerCase(), command);
        loaded++;
      } catch (err) {
        console.error(chalk.red(`[Commands] Failed to load ${category}/${file}: ${err.message}`));
      }
    }
    console.log(chalk.green(`[Commands] ${category.padEnd(12)} ${loaded} command(s)`));
    total += loaded;
  }
  console.log(chalk.cyan(`[Commands] Total: ${total}\n`));
}

// Load events from events/ folder
function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  const files = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
  console.log(chalk.cyan(`[Events] Loading ${files.length} events...`));
  for (const file of files) {
    const eventName = file.split('.')[0];
    const event     = require(path.join(eventsPath, file));
    if (eventName === 'clientReady') {
      client.once(eventName, event.bind(null, client));
    } else {
      client.on(eventName, event.bind(null, client));
    }
    console.log(chalk.green(`[Events] Registered: ${eventName}`));
  }
  console.log('');
}

// Load music player events from events/music/ folder
function loadMusicEvents() {
  const musicEventsPath = path.join(__dirname, 'events/music');
  if (!fs.existsSync(musicEventsPath)) {
    console.warn(chalk.yellow('[Music] events/music/ folder not found, skipping.'));
    return;
  }
  const files = fs.readdirSync(musicEventsPath).filter(f => f.endsWith('.js'));
  console.log(chalk.cyan(`[Music] Loading ${files.length} player events...`));
  for (const file of files) {
    const event = require(path.join(musicEventsPath, file));
    event(client);
    console.log(chalk.green(`[Music] Registered: ${file}`));
  }
  console.log('');
}


// Command reload function
const reload = (message, cmdName) => {
  const tools = client.tools;
  for (const category of config.commands) {
    const filePath = path.join(__dirname, 'commands', category, `${cmdName}.js`);
    if (!fs.existsSync(filePath)) continue;
    try {
      delete require.cache[require.resolve(filePath)];
      const command = require(filePath);
      client.commands.set(command.help.name.toLowerCase(), command);
      return tools.success(message, `\`${cmdName}\` reloaded successfully.`, client)
        .then(msg => setTimeout(() => msg?.delete().catch(() => {}), 5000));
    } catch (err) {
      return tools.error(message, `Failed to reload \`${cmdName}\`: ${err.message}`, client)
        .then(msg => setTimeout(() => msg?.delete().catch(() => {}), 5000));
    }
  }
  tools.error(message, `Command \`${cmdName}\` not found in any category.`, client)
    .then(msg => setTimeout(() => msg?.delete().catch(() => {}), 5000));
};

exports.reload = reload;
client.reload  = reload;

// Main async function to initialize the bot
(async () => {
  printBanner();
  loadCommands();
  loadEvents();

  // Print which voice/crypto/opus/ffmpeg libs actually loaded.
  const { generateDependencyReport } = require('@discordjs/voice');
  console.log(chalk.cyan('[Voice] Dependency report:'));
  console.log(generateDependencyReport());

  const player = new Player(client);
  // SoundCloud, Spotify, Apple Music, Vimeo, etc.
  const { DefaultExtractors } = require('@discord-player/extractor');
  await player.extractors.loadMulti(DefaultExtractors);
  // useYoutubeDL routes streaming through yt-dlp, which tracks YouTube changes.
  await player.extractors.register(YoutubeiExtractor, { useYoutubeDL: true });
  client.player = player;
  console.log(chalk.green('[Music] Player ready.\n'));

  loadMusicEvents();

// Set initial activity status
  client.once('clientReady', () => {
    client.user.setActivity(`${config.prefix}help | ${brand.name}`, { type: ActivityType.Playing });
  });

  // Bot Login to Discord
  await client.login(config.token)
    .then(() => console.log(chalk.green('[Auth] Login successful.\n')))
    .catch(err => {
      console.error(chalk.red(`[Auth] Login failed: ${err.message}`));
      // Token shape (not value) to help spot a bad paste.
      const dots = (config.token.match(/\./g) || []).length;
      console.error(chalk.yellow(
        `[Auth] Token received: ${config.token.length} chars, ${dots} dot(s). ` +
        `A valid bot token is ~70 chars with exactly 2 dots.`));
      process.exit(1);
    });
})();