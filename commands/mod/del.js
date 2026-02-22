const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'You need `MANAGE_CHANNELS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'I need `MANAGE_CHANNELS` permission.', client);
  if (!args.length) return tools.error(message, 'Usage: `del <channel name>`', client);

  const name    = args.join(' ').toLowerCase();
  const channel = message.guild.channels.cache.find(c => c.name.toLowerCase() === name);
  if (!channel) return tools.error(message, `No channel found with name \`${name}\`.`, client);

  const channelName = channel.name;
  await channel.delete().catch(() => null);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':wastebasket: Channel Deleted')
    .addFields({ name: 'Channel', value: `\`${channelName}\`` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'del', description: 'Delete a channel by name.', usage: 'del <channel name>' };