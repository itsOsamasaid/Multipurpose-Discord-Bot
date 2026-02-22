const { PermissionFlagsBits } = require('discord.js');
const path = require('path');
const log = require(path.join(__dirname, '../../database/log.json'));

exports.run = (client, message, args, tools) => {

  if (!message.channel.guild) return message.reply('** This command only for servers**');
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return tools.error(message, "I Don't Have `BAN_MEMBERS` Permission", client);
  if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return tools.error(message, "You Don't Have `BAN_MEMBERS` Permission", client);
  let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(2).join(" ");
  if (message.mentions.users.size < 1) return tools.error(message, "Mention A Member ! :warning:", client);
  if (!reason) return tools.error(message, "Write A Reason ! :warning:", client);
  if (!message.guild.members.cache.get(user.id)?.bannable) return tools.error(message, "I Can't Ban A Higher Role Than Me :x:", client);

  message.guild.members.cache.get(user.id).ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason });

  const embed = tools.brandedEmbed(client)
    .setAuthor({ name: 'BANNED!', iconURL: user.displayAvatarURL() })
    .addFields(
      { name: '**User:**',   value: `**[ ${user.tag} ]**` },
      { name: '**By:**',     value: `**[ ${message.author.tag} ]**` },
      { name: '**Reason:**', value: `**[ ${reason} ]**` }
    )

  message.channel.send({ embeds: [embed] });
}

exports.help = {
  name: 'ban',
  description: 'ban a member From The Server.',
  usage: 'ban @member <reason>'
};