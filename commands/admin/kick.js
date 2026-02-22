const { PermissionFlagsBits } = require('discord.js');
const path = require('path');
const log = require(path.join(__dirname, '../../database/log.json'));

exports.run = (client, message, args, tools) => {
  const auditlogchannel = log[message.guild.id]?.logchannel
    ? message.guild.channels.cache.get(log[message.guild.id].logchannel)
    : null;

  if (!message.channel.guild) return message.reply('** This command only for servers**');
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) return tools.error(message, "I Don't Have `KICK_MEMBERS` Permission", client);
  if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return tools.error(message, "You Don't Have `KICK_MEMBERS` Permission", client);
  let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(2).join(" ");
  if (message.mentions.users.size < 1) return tools.error(message, "Mention A Member ! :warning:", client);
  if (!reason) return tools.error(message, "Write A Reason ! :warning:", client);
  if (!message.guild.members.cache.get(user.id)?.kickable) return tools.error(message, "I Can't Kick A Higher Role Than Me :x:", client);

  message.guild.members.cache.get(user.id).kick(reason);

  const embed = tools.brandedEmbed(client)
    .setAuthor({ name: 'KICKED!', iconURL: user.displayAvatarURL() })
    .addFields(
      { name: '**User:**',   value: `**[ ${user.tag} ]**` },
      { name: '**By:**',     value: `**[ ${message.author.tag} ]**` },
      { name: '**Reason:**', value: `**[ ${reason} ]**` }
    )

  message.channel.send({ embeds: [embed] });
  if (auditlogchannel) auditlogchannel.send({ embeds: [embed] });
}

exports.help = {
  name: 'kick',
  description: 'kick a member from The Server.',
  usage: 'kick @member <reason>'
};