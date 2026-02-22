const { PermissionFlagsBits, ChannelType } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'You need `MANAGE_CHANNELS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'I need `MANAGE_CHANNELS` permission.', client);
  if (!args.length) return tools.error(message, 'Usage: `ct <channel name>`', client);

  const name = args.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const channel = await message.guild.channels.create({ name, type: ChannelType.GuildText }).catch(() => null);
  if (!channel) return tools.error(message, 'Failed to create channel.', client);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':speech_balloon: Text Channel Created')
    .addFields({ name: 'Channel', value: `${channel}` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'ct', description: 'Create a text channel.', usage: 'ct <name>' };