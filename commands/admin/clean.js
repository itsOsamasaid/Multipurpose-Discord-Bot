const { PermissionFlagsBits } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../database/config.json'));
const warns = require(path.join(__dirname, '../../database/warnings.json'));

exports.run = async (client, message, args, tools) => {
  var heg = message.mentions.users.first();
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return tools.error(message, "You Don't Have `ADMINISTRATOR` Permission", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) return tools.error(message, "I Don't Have `ADMINISTRATOR` Permission", client);
  if (!heg) return tools.error(message, 'Usage: `clean @member`', client);
  if (!warns[message.guild.id]?.[heg.id]) return tools.error(message, "This User Doesn't Have Warns :warning:", client);
  warns[message.guild.id][heg.id].warns = 0;

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(`**${heg.username}** Warns Were Cleaned :white_check_mark:`)

  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'clean',
  description: 'clean User Warns.',
  usage: 'clean @member'
};