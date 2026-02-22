# Multipurpose Discord Bot

A versatile multipurpose Discord bot built with Node.js and discord.js v14 — featuring moderation, music playback, leveling, games, utilities, and full server management.

## 🚀 What it does

A full-featured bot designed to handle everything your Discord server needs. Modular command structure, event-based architecture, per-guild configuration, and a music system that works across multiple servers simultaneously with isolated queues.

## 🎯 Key Features

- **Moderation** — ban, kick, mute, warn, purge, rename, channel management
- **Music** — YouTube playback via discord-player v6, per-guild queues, filters, loop, shuffle
- **Leveling & XP** — automatic XP tracking, level-up cards via Canvas
- **Economy** — credits, daily rewards, rep system
- **Games** — quiz games (capitals, flags, emoji, proverbs), rock paper scissors, giveaways
- **Info commands** — user info, server info, role info, avatar, color lookup, prayer times
- **Special features** — autorole, welcome system, image welcome, logging, temp voice channels, ad blocking, voice online counter
- **Owner tools** — reload commands, DM users, manage servers, set activity
- **Logging** — DM forwarding, command usage logs, name history tracking

## 🛠 Tech Stack

- **Runtime** — Node.js v18+
- **Discord** — discord.js v14
- **Music** — discord-player v6 + discord-player-youtubei
- **Audio** — FFmpeg + @discordjs/opus
- **Canvas** — canvas (level-up cards, ID cards)
- **Database** — JSON flat-file (per-guild configs, userdata, logs)

## 📦 Getting Started

### Prerequisites

- Node.js v18 or higher
- FFmpeg installed on your system
- A Discord Bot Token with the following **Privileged Intents** enabled in the Developer Portal:
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

The `install.sh` script installs FFmpeg, canvas build tools, and all npm packages in one step.

### Configuration

Edit `database/config.json`:

```json
{
  "token": "your_bot_token",
  "prefix": "&",
  "owner": "your_user_id",
  "branding": {
    "name": "Your Bot Name",
    "version": "1.0.0",
    "footer": "Your footer text",
    "colors": {
      "primary": "ffffff"
    }
  }
}
```

### Running

```bash
node index.js
```

## 📁 Folder Structure

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
├── install.sh        # One-click dependency installer
└── index.js
```

## 📌 Command Categories

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

## ⚙️ Migration Note (v11 → v14)

This bot was fully migrated from discord.js v11 to v14.

## 🤝 Contributing

Contributions are welcome. Fork → branch → commit → PR.

## 📄 License

MIT License.