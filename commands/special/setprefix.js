const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/guilddata.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);
  if (!args[0]) return tools.error(message, 'Please provide a new prefix. Usage: `setprefix <prefix>`', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = {};

  const newPrefix = args[0];
  db[message.guild.id].prefix = newPrefix;
  save(db);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':label: Prefix Updated')
    .addFields({ name: 'New Prefix', value: `\`${newPrefix}\`` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'setprefix', description: 'Change the bot prefix.', usage: 'setprefix <prefix>' };