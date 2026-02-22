const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/adblock.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = { adblock: false };

  db[message.guild.id].adblock = !db[message.guild.id].adblock;
  const state = db[message.guild.id].adblock;
  save(db);

  const embed = tools.brandedEmbed(client, state ? 'success' : 'error')
    .setTitle(`:no_entry: Ad Block ${state ? 'Enabled' : 'Disabled'}`)
    .setDescription(state ? '🔔 Ad blocking is now **ON**.' : '🔕 Ad blocking is now **OFF**.');
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'adblock', description: 'Toggle ad blocking.', usage: 'adblock' };