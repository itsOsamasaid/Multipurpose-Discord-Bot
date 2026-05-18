# Multipurpose Discord Bot

A Discord bot I built to handle most of what a server actually needs — moderation, music, leveling, a few games, and the usual utility commands. It's written in Node.js with discord.js v14.

## What it does

It's a general-purpose bot, so it does a bit of everything. Commands are split into modules, events drive most of the behavior, and each server gets its own config. The music system runs per-guild, so queues stay isolated and several servers can play at once without stepping on each other.

## Features

- **Moderation** — ban, kick, mute, warn, purge, rename, channel management
- **Music** — YouTube playback through discord-player v6, per-guild queues, filters, loop, shuffle
- **Leveling & XP** — XP tracks automatically, level-up cards are drawn with Canvas
- **Economy** — credits, daily rewards, a rep system
- **Games** — quiz games (capitals, flags, emoji, proverbs), rock paper scissors, giveaways
- **Info commands** — user, server, role, avatar, color lookup, prayer times
- **Server setup** — autorole, welcome messages (text and image), logging, temp voice channels, ad blocking, voice online counter
- **Owner tools** — reload commands, DM users, manage servers, set the bot's activity
- **Logging** — DM forwarding, command usage, name history

## Tech stack

- **Runtime** — Node.js v18+
- **Discord** — discord.js v14
- **Music** — discord-player v6 with discord-player-youtubei
- **Audio** — FFmpeg and @discordjs/opus
- **Canvas** — the `canvas` package, for level-up cards and ID cards
- **Database** — plain JSON files (per-guild configs, user data, logs)

The JSON "database" is intentionally simple — no external DB to set up. It works fine for small-to-medium servers; if you're running this at scale you'll probably want to swap it out.

## Getting started

### Prerequisites

- Node.js v18 or higher
- FFmpeg installed on your system
- A Discord bot token with these **privileged intents** enabled in the Developer Portal:
  - `GUILD_MEMBERS`
  - `MESSAGE_CONTENT`
  - `GUILD_PRESENCES`

### Installation

```bash
git clone https://github.com/itsOsamasaid/Multipurpose-Discord-Bot.git
cd Multipurpose-Discord-Bot
chmod +x install.sh
./install.sh
```

`install.sh` handles FFmpeg, the build tools Canvas needs, and all the npm packages — so you shouldn't have to install anything by hand.

### Configuration

**Running it yourself (a config file)**

Copy the template:

```bash
cp database/config.example.json database/config.json
```

Then open `database/config.json` and fill in:

- `token` — your bot token from the Discord Developer Portal
- `clientid` — your bot's application ID
- `owner` — your own Discord user ID (unlocks owner-only commands)
- `prefix` — command prefix, defaults to `!`


### Running

```bash
node index.js
```

## Folder structure

```
├── commands/
│   ├── admin/        # Ban, kick, mute, warn, etc.
│   ├── bank/         # Economy and credits
│   ├── colors/       # Color roles
│   ├── fun/          # Fun commands
│   ├── games/        # Quiz games, RPS, giveaways
│   ├── general/      # Utility commands
│   ├── info/         # User/server/role info
│   ├── mod/          # Channel and nickname management
│   ├── music/        # Music playback (discord-player v6)
│   ├── owner/        # Owner-only commands
│   └── special/      # Server config (welcome, logs, autorole...)
├── events/
│   ├── music/        # discord-player v6 event handlers
│   └── *.js          # Discord client events
├── database/         # JSON data files
├── modules/          # Shared utilities (tools, functions)
├── storage/          # Images (backgrounds, level cards)
├── util/             # Logger
├── install.sh        # One-step dependency installer
└── index.js
```

## Command categories

| Category | Examples |
|----------|---------|
| Admin | `ban`, `kick`, `mute`, `warn`, `unwarn` |
| Music | `play`, `skip`, `stop`, `pause`, `resume`, `queue`, `np`, `loop`, `shuffle`, `filter`, `volume` |
| Info | `ui`, `si`, `ri`, `avatar`, `colori`, `adhan`, `td` |
| Games | `capitals`, `flags`, `emoji`, `fakek`, `amthal`, `rps`, `giveaway` |
| General | `remind`, `timer`, `translate`, `toptext`, `topvoice`, `top` |
| Mod | `purge`, `rename`, `mchannel`, `unmchannel`, `move`, `ct`, `cv` |
| Special | `setwlc`, `setlog`, `autorole`, `tempv`, `vonline`, `setprefix` |
| Owner | `reload`, `dm`, `servers`, `setact`, `setav`, `restart` |

## A note on the v11 → v14 migration

This bot started life on discord.js v11 and has since been fully migrated to v14. That was a big jump, so if you spot anything that still smells like old code, that's probably why — feel free to open an issue.