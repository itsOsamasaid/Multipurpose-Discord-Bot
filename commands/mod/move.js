const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers))
    return tools.error(message, 'You need `MOVE_MEMBERS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers))
    return tools.error(message, 'I need `MOVE_MEMBERS` permission.', client);

  const target = message.mentions.members.first();
  if (!target) return tools.error(message, 'Usage: `move @member`', client);

  const authorVC = message.member.voice.channel;
  if (!authorVC) return tools.error(message, 'You must be in a voice channel.', client);

  if (!target.voice.channel)
    return tools.error(message, `**${target.user.username}** is not in a voice channel.`, client);

  await target.voice.setChannel(authorVC).catch(() => null);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':arrow_right: Member Moved')
    .addFields(
      { name: 'Member',  value: `${target}`,        inline: true },
      { name: 'Channel', value: `${authorVC}`,       inline: true }
    );
  message.channel.send({ embeds: [embed] });

  // DM the moved member
  target.send({ embeds: [
    tools.brandedEmbed(client, 'info')
      .setTitle(`You were moved in ${message.guild.name}`)
      .setDescription(`**${message.author.tag}** moved you to **${authorVC.name}**.`)
  ]}).catch(() => {});
};

exports.help = { name: 'move', description: 'Move a member to your voice channel.', usage: 'move @member' };