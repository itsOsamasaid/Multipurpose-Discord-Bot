const { PermissionFlagsBits } = require('discord.js');
const path      = require('path');
const guilddata = require(path.join(__dirname, '../../database/guild.json'));

exports.run = (client, message, args, tools) => {
  const p = guilddata[message.guild.id]?.prefix ?? client.config.prefix;
  const brand = client.config.branding;

  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.AddReactions))
    return tools.error(message, ':lock: I need `ADD_REACTIONS` permission to show help.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))
    return tools.error(message, ':lock: I need `EMBED_LINKS` permission to show help.', client);

  const ini = (content) => `\`\`\`ini\n${content}\n\`\`\``;

  const pages = [
    // Page 1 — General
    ini(`[ General ]
${p}8ball      :: Ask ${brand.name} a question
${p}choose     :: Make ${brand.name} choose from inputs
${p}city       :: Info about a city
${p}embed      :: Convert text into an embed
${p}gif        :: Search for an animated gif
${p}invs       :: Preview member's invites
${p}rate       :: Rate something out of 10
${p}remind     :: Set a reminder
${p}short      :: Shorten a URL
${p}timer      :: Start a timer
${p}translate  :: Translate text to any language
${p}top        :: Top invites leaderboard
${p}topvoice   :: Top voice active users
${p}toptext    :: Top text active users
${p}lastseen   :: Last seen info for a member`),

    // Page 2 — Setup / Special
    ini(`[ Setup & Special ]
${p}setprefix  :: Set a new prefix for your server
${p}setlog     :: Set a channel for event logging
${p}adblock    :: Enable/disable ad block
${p}autorole   :: Set auto-role for new members
${p}tempv      :: Temporary voice channel system
${p}giveaway   :: Start a timed giveaway

[ Image Welcome ]
${p}setiwlc    :: Set image welcome channel
${p}iwlc       :: Preview image welcome status
${p}iwlctoggle :: Enable/disable image welcome

[ Text Welcome ]
${p}setwlc     :: Set welcome channel
${p}wlc        :: Preview welcome status
${p}wlctoggle  :: Enable/disable welcome
${p}wlcdm      :: Enable/disable DM welcome
${p}wlcmsg     :: Set the welcome message`),

    // Page 3 — Admin
    ini(`[ Administration ]
${p}ban        :: Ban a member
${p}softban    :: Ban + clear messages then unban
${p}warn       :: Warn a member (auto-escalates)
${p}warnlist   :: View server warn list
${p}warnlevel  :: View a member's warn count
${p}clean      :: Clear a member's warnings
${p}kick       :: Kick a member
${p}vkick      :: Kick a member from voice
${p}mute       :: Mute a member
${p}mutelist   :: View muted members
${p}unmute     :: Unmute a member
${p}clear      :: Bulk delete messages
${p}role       :: Give/remove roles`),

    // Page 4 — Moderation
    ini(`[ Moderation ]
${p}mchannel   :: Lock a text channel
${p}unmchannel :: Unlock a text channel
${p}v2m        :: Temp channel for 2 minutes
${p}cr         :: Create a role
${p}ct         :: Create a text channel
${p}cv         :: Create a voice channel
${p}del        :: Delete a channel
${p}purge      :: Delete limited messages
${p}rename     :: Rename a member`),

    // Page 5 — Bank / Economy
    ini(`[ Bank & Economy ]
${p}credits    :: View member's credits
${p}credit     :: Transfer credits to a user
${p}leaderboard:: Global leaderboard
${p}daily      :: Claim daily credits
${p}level      :: View your level and XP
${p}rep        :: Give reputation to a member
${p}slots      :: Play slots with credits
${p}bgs        :: View profile backgrounds
${p}setbg      :: Buy a profile background
${p}setinfo    :: Set your profile bio
${p}profile    :: View a member's profile`),

    // Page 6 — Music
    ini(`[ Music ]
${p}play       :: Play a song (search or URL)
${p}skip       :: Skip the current song
${p}stop       :: Stop queue and leave
${p}pause      :: Pause current song
${p}resume     :: Resume paused song
${p}np         :: Now playing
${p}queue      :: View queue`),

    // Page 7 — Colors
    ini(`[ Colors ]
${p}color      :: Pick a color role
${p}colors     :: View server color roles
${p}ccolors    :: Generate 50 random colors
${p}dcolors    :: Delete server color roles`),

    // Page 8 — Fun
    ini(`[ Fun ]
${p}text       :: Generate cool symbol text
${p}flip       :: Flip a coin
${p}penis      :: 🍆 meter
${p}roll       :: Random number
${p}cat        :: Random cat photo
${p}bond       :: Love meter with a member
${p}clap       :: 👏 text
${p}joke       :: Random joke
${p}kill       :: Kill a member (fun)
${p}reverse    :: Reverse text
${p}rps        :: Rock Paper Scissors`),

    // Page 9 — Information
    ini(`[ Information ]
${p}ui         :: User info
${p}mi         :: Member info
${p}si         :: Server info
${p}id         :: User/role ID lookup
${p}av         :: View avatar
${p}ri         :: Server icon
${p}td         :: Role info
${p}names      :: Previous usernames/nicknames
${p}topinv     :: Top 10 inviters
${p}colori     :: Color info by hex
${p}adhan      :: Prayer times`),

    // Page 10 — Bot Info
    ini(`[ Bot Info ]
${p}stats      :: Bot stats (owner only)
${p}ping       :: Bot latency
${p}inv        :: Invite ${brand.name}
${p}info       :: About ${brand.name}
${p}contact    :: Message the bot owner`),
  ];

  let page = 0;

  const buildEmbed = () => tools.brandedEmbed(client)
    .setTitle(`${brand.name} — Help`)
    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.config.clientid}&permissions=2080374975&scope=bot`)
    .setDescription(pages[page])
    .setFooter({ text: `Page ${page + 1} of ${pages.length} • ${brand.footer}`, iconURL: client.user.displayAvatarURL() });

  message.channel.send({ embeds: [buildEmbed()] }).then(msg => {
    msg.react('⏪').then(() => msg.react('◀').then(() => msg.react('▶').then(() => msg.react('⏩')))).catch(() => {});

    const filter = (reaction, user) => ['⏪','◀','▶','⏩'].includes(reaction.emoji.name) && user.id === message.author.id;
    const collector = msg.createReactionCollector({ filter, time: 60000 });

    collector.on('collect', (reaction, user) => {
      reaction.users.remove(user.id).catch(() => {});
      if      (reaction.emoji.name === '⏪') page = 0;
      else if (reaction.emoji.name === '◀') page = Math.max(0, page - 1);
      else if (reaction.emoji.name === '▶') page = Math.min(pages.length - 1, page + 1);
      else if (reaction.emoji.name === '⏩') page = pages.length - 1;
      msg.edit({ embeds: [buildEmbed()] }).catch(() => {});
    });

    collector.on('end', () => msg.reactions.removeAll().catch(() => {}));
  });
};

exports.help = {
  name: 'help',
  description: 'Interactive paginated help menu.',
  usage: 'help'
};