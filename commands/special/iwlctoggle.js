const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/iwlc.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = { iwlctoggle: false, iwlcchannel: null };

  db[message.guild.id].iwlctoggle = !db[message.guild.id].iwlctoggle;
  const state = db[message.guild.id].iwlctoggle;
  save(db);

  const embed = tools.brandedEmbed(client, state ? 'success' : 'error')
    .setTitle(`:frame_photo: Image Welcome ${state ? 'Enabled' : 'Disabled'}`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'iwlctoggle', description: 'Toggle image welcome on/off.', usage: 'iwlctoggle' };