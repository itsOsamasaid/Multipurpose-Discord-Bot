const { PermissionFlagsBits } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../database/config.json'));
const warns = require(path.join(__dirname, '../../database/warnings.json'));

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;

  const heg = message.mentions.users.first() || message.author;
  if (!warns[message.guild.id]?.[heg.id]) {
    return tools.error(message, 'This user has no warnings in the system.', client);
  }

  const embed = tools.brandedEmbed(client, 'warning')
    .setTitle(`:warning: Warning Profile for ${heg.username}`)
    .addFields(
      { name: ':bust_in_silhouette: User',          value: heg.tag,                                              inline: true },
      { name: ':1234: Number Of Warnings',           value: `**${warns[message.guild.id][heg.id].warns}**`,      inline: true }
    )
  message.channel.send({ embeds: [embed] });
}

exports.help = {
  name: 'warnlevel',
  description: "Preview member's warn level.",
  usage: 'warnlevel @member'
};