const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'You need `MANAGE_CHANNELS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'I need `MANAGE_CHANNELS` permission.', client);

  await message.channel.permissionOverwrites.edit(message.guild.id, {
    SendMessages: false,
  }).catch(() => null);

  const embed = tools.brandedEmbed(client, 'warning')
    .setTitle(':lock: Channel Muted')
    .setDescription(`**${message.channel}** has been muted. No one can send messages.`)
    .setFooter({ text: `By: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'mchannel', description: 'Mute the current channel.', usage: 'mchannel' };