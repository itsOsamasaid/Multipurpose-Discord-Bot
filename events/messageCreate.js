const { EmbedBuilder, ChannelType, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const fs   = require('fs');
const path = require('path');
const chalk = require('chalk');
const Canvas = require('canvas');

const config    = require(path.join(__dirname, '../database/config.json'));
const warns     = require(path.join(__dirname, '../database/warnings.json'));
const userdata  = require(path.join(__dirname, '../database/userdata.json'));
const games     = require(path.join(__dirname, '../database/games.json'));
const adblock   = require(path.join(__dirname, '../database/adblock.json'));
const text      = require(path.join(__dirname, '../database/text.json'));
const names     = require(path.join(__dirname, '../database/names.json'));
const guilddata = require(path.join(__dirname, '../database/guild.json'));
const last      = require(path.join(__dirname, '../database/last.json'));

const LEVEL_UP_IMG = path.join(__dirname, '../storage/leveling/levll.png');
const DEFAULT_BG   = path.join(__dirname, '../storage/profilebg/1.png');

module.exports = async (client, message) => {

    // DM forwarder
    if (message.channel.type === ChannelType.DM) {
        if (message.author.id === client.user.id) return;
        const dmLogChannel = client.channels.cache.get(config.dmLogChannel);
        if (dmLogChannel) {
            const iiMo = new EmbedBuilder()
                .setColor(0xffc000)
                .setTimestamp()
                .setTitle('I have received a new DM!')
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(`\`\`\`${message.content}\`\`\``)
                .setFooter({ text: `From ${message.author.tag} (${message.author.id})` });
            dmLogChannel.send({ embeds: [iiMo] }).catch(() => {});
        }
        await message.channel.sendTyping();
        return;
    }

    // Early exits — consolidated, run once
    if (message.author.bot) return;
    if (!message.guild) return;

    // bot mention
    if (message.mentions.users.has(client.user.id)) {
        if (!guilddata[message.guild.id]) return;
        const prefix = guilddata[message.guild.id].prefix;
        message.channel.send(`**Hey ${message.author.username}, try \`${prefix}help\`**`);
    }

    // last
    if (!last[message.guild.id]) last[message.guild.id] = {};
    if (!last[message.guild.id][message.author.id]) last[message.guild.id][message.author.id] = { last: '' };
    fs.writeFile(config.db.last, JSON.stringify(last, null, 2), err => { if (err) console.error(err); });

    // games
    if (!games[message.guild.id]) games[message.guild.id] = {};
    if (!games[message.guild.id][message.author.id]) games[message.guild.id][message.author.id] = { wins: 0, loses: 0 };
    fs.writeFile(config.db.games, JSON.stringify(games, null, 2), err => { if (err) console.error(err); });

    // toptext
    if (!text[message.guild.id]) text[message.guild.id] = {};
    if (!text[message.guild.id][message.author.id]) text[message.guild.id][message.author.id] = { username: message.author.tag, xp: 0, level: 0 };
    text[message.guild.id][message.author.id].username = message.author.tag;
    fs.writeFile(config.db.text, JSON.stringify(text, null, 2), err => { if (err) console.error(err); });

    // warnings
    if (!warns[message.guild.id]) warns[message.guild.id] = {};
    if (!warns[message.guild.id][message.author.id]) warns[message.guild.id][message.author.id] = { warns: 0 };
    fs.writeFile(config.db.warnings, JSON.stringify(warns, null, 2), err => { if (err) console.error(err); });

    // names
    if (!names[message.guild.id]) names[message.guild.id] = {};
    if (!names[message.guild.id][message.author.id]) names[message.guild.id][message.author.id] = { usernames: '', nicknames: '' };
    fs.writeFile(config.db.names, JSON.stringify(names, null, 2), err => { if (err) console.error(err); });

    // BANK / XP / level-up
    if (!userdata[message.author.id]) userdata[message.author.id] = {
        username:    message.author.tag,
        points:      0,
        level:       0,
        reps:        0,
        credits:     0,
        xp:          0,
        info:        '',
        cbg:         DEFAULT_BG,
        lastrep:     '',
        lastdaily:   '',
    };

    const userData = userdata[message.author.id];
    userData.xp++;
    userData.username = message.author.tag;

    const curLevel = Math.floor(0.1 * Math.sqrt(userData.xp));
    if (curLevel > userData.level) {
        userData.level = curLevel;
        const canvas  = Canvas.createCanvas(84, 120);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(LEVEL_UP_IMG);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ extension: 'jpg' }));
        context.drawImage(avatar, 21, 25, 40, 40);
        context.font      = '15px Bold';
        context.fillStyle = '#909090';
        context.textAlign = 'center';
        context.fillText(userData.level, 48, 110);
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'levelup.png' });
        message.channel.send({ content: `:arrow_up: | **${message.author.username}, leveled up!**`, files: [attachment] });
    }

    // ranking
    const arr = Object.keys(userdata);
    arr.sort((a, b) => userdata[b].xp - userdata[a].xp);
    for (let i = 0, rank = 1; i < arr.length; i++) {
        userdata[arr[i]].rank = rank;
        if (userdata[arr[i + 1]] && userdata[arr[i]].xp !== userdata[arr[i + 1]].xp) rank++;
    }

    fs.writeFile(config.db.userdata, JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });

    // adblock
    if (adblock[message.guild.id]?.adblock === true && message.content.includes('https://')) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            message.delete().catch(() => {});
            const reply = await message.channel.send(`**You're not allowed to advertise here! :x:**`).catch(() => {});
            if (reply) client.tools.deleteAfter(reply, 3000);
            return;
        }
    }

    // guild prefix guard
    if (!guilddata[message.guild.id]) return;
    const prefix = guilddata[message.guild.id].prefix;

    // command log
    if (message.content.startsWith(prefix)) {
        console.log(chalk.yellow(`[${message.guild.name} - ${message.guild.memberCount}] >> ${message.author.tag} >> ${message.content}`));
    }

    // command dispatch (merged from evnts/message.js)
    if (!message.content.startsWith(prefix)) return;
    const args    = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();
    const cmd     = client.commands.get(cmdName)
                 || client.commands.find(c => c.help?.aliases && c.help.aliases.includes(cmdName));
    if (!cmd) return;

    try {
        await cmd.run(client, message, args, client.tools);
    } catch (err) {
        console.error(`[Command:${cmdName}] ${err.message}`);
        client.tools.error(message, `An error occurred while running that command.`, client);
    }
};
