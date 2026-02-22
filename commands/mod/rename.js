const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames))
    return tools.error(message, 'You need `MANAGE_NICKNAMES` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames))
    return tools.error(message, 'I need `MANAGE_NICKNAMES` permission.', client);

  const target = message.mentions.members.first();
  if (!target) return tools.error(message, 'Usage: `rename @member <new nickname>`', client);

  const nickname = args.slice(1).join(' ');
  if (!nickname) return tools.error(message, 'Please provide a new nickname.', client);

  await target.setNickname(nickname).catch(() => null);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':pencil: Nickname Changed')
    .addFields(
      { name: 'Member',       value: `${target}`,       inline: true },
      { name: 'New Nickname', value: `\`${nickname}\``, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'rename', description: 'Change a member nickname.', usage: 'rename @member <nickname>' };