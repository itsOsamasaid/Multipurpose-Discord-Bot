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

const config = require('./database/config.json');
const brand  = config.branding;

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

  const player = new Player(client);
  await player.extractors.register(YoutubeiExtractor, {});
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
    .catch(err => console.error(chalk.red(`[Auth] Login failed:\n${err}`)));
})();