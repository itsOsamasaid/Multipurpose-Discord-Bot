const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/log.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);

  const channel = message.mentions.channels.first();
  if (!channel) return tools.error(message, 'Mention a channel. Usage: `setlog #channel`', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = {};

  db[message.guild.id].logchannel = channel.id;
  db[message.guild.id].logtoggle  = true;
  save(db);

  // Make log channel view-only for @everyone
  await channel.permissionOverwrites.edit(message.guild.id, {
    SendMessages: false,
    ViewChannel:  true,
  }).catch(() => {});

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':scroll: Log Channel Set')
    .addFields({ name: 'Channel', value: `${channel}` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'setlog', description: 'Set the log channel.', usage: 'setlog #channel' };