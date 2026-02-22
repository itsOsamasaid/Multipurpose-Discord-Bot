const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  let userSoftban = message.mentions.users.first();
  let reasonSoftban = args.slice(1).join(' ');

  if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return tools.error(message, "You need `BAN_MEMBERS` Permission to execute `SoftBan`", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return tools.error(message, "I need `BAN_MEMBERS` Permission to execute `SoftBan`", client);
  if (!userSoftban) return tools.error(message, 'You must mention a user. Usage: `softban @member <reason>`', client);
  if (message.author.id === userSoftban.id) return tools.error(message, "You can't punish yourself :wink:", client);
  if (!reasonSoftban) return tools.error(message, 'You must give a reason. Usage: `softban @member <reason>`', client);

  userSoftban.send(`You've been softbanned from **${message.guild.name}**\nReason: **${reasonSoftban}**\nYou may rejoin immediately.`).catch(() => {});
  await message.guild.members.ban(userSoftban, { deleteMessageSeconds: 2 * 24 * 60 * 60, reason: reasonSoftban });
  await message.guild.bans.remove(userSoftban.id).catch(() => {});

  const embed = tools.brandedEmbed(client)
    .setTitle('Softban')
    .addFields(
      { name: 'Softbanned', value: `${userSoftban.tag}` },
      { name: 'Moderator',  value: message.author.tag },
      { name: 'Reason',     value: reasonSoftban }
    )
  message.channel.send({ embeds: [embed] });
}

exports.help = {
  name: 'softban',
  description: 'Ban a member then immediately unban to clear messages.',
  usage: 'softban @member <reason>'
};