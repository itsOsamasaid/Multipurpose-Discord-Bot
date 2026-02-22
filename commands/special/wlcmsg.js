const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/wlc.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);
  if (!args.length) return tools.error(message,
    'Usage: `wlcmsg <message>`\nVariables: `<user>` `<server>` `<count>`', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = {};

  const msg = args.join(' ');
  db[message.guild.id].wlcmsg = msg;
  save(db);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':wave: Welcome Message Set')
    .addFields({ name: 'Message', value: `\`${msg}\`` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'wlcmsg', description: 'Set the welcome message.', usage: 'wlcmsg <message>' };