const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/autorole.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = { autorole: null, autoroletoggle: false };

  if (db[message.guild.id].autoroletoggle) {
    // Show current status
    const roleId = db[message.guild.id].autorole;
    const role   = message.guild.roles.cache.get(roleId);
    const embed  = tools.brandedEmbed(client, 'info')
      .setTitle(':gear: Autorole Status')
      .addFields(
        { name: 'Role',   value: role ? `${role}` : `\`${roleId}\``, inline: true },
        { name: 'Status', value: '`enabled`',                         inline: true }
      )
      .setDescription('Use `autorolet` to toggle autorole off.');
    return message.channel.send({ embeds: [embed] });
  }

  const role = message.mentions.roles.first();
  if (!role) return tools.error(message, 'Please mention a role. Usage: `autorole @role`', client);

  db[message.guild.id].autorole       = role.id;
  db[message.guild.id].autoroletoggle = true;
  save(db);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':gear: Autorole Set')
    .addFields({ name: 'Role', value: `${role}` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'autorole', description: 'Set autorole for new members.', usage: 'autorole @role' };