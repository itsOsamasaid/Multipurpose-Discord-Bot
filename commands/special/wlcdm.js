const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/wlc.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = { wlcdm: false };

  db[message.guild.id].wlcdm = !db[message.guild.id].wlcdm;
  const state = db[message.guild.id].wlcdm;
  save(db);

  const embed = tools.brandedEmbed(client, state ? 'success' : 'error')
    .setTitle(`:envelope: DM Welcome ${state ? 'Enabled' : 'Disabled'}`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'wlcdm', description: 'Toggle DM welcome message.', usage: 'wlcdm' };