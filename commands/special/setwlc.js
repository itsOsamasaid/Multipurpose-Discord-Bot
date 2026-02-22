const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/wlc.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);

  const channel = message.mentions.channels.first();
  if (!channel) return tools.error(message, 'Mention a channel. Usage: `setwlc #channel`', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = {};

  db[message.guild.id].wlcchannel = channel.id;
  db[message.guild.id].wlctoggle  = true;
  save(db);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':wave: Welcome Channel Set')
    .addFields({ name: 'Channel', value: `${channel}` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'setwlc', description: 'Set the welcome channel.', usage: 'setwlc #channel' };