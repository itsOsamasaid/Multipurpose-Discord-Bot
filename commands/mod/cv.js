const { PermissionFlagsBits, ChannelType } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'You need `MANAGE_CHANNELS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'I need `MANAGE_CHANNELS` permission.', client);
  if (!args.length) return tools.error(message, 'Usage: `cv <channel name>`', client);

  const name = args.join(' ');
  const channel = await message.guild.channels.create({ name, type: ChannelType.GuildVoice }).catch(() => null);
  if (!channel) return tools.error(message, 'Failed to create voice channel.', client);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':microphone2: Voice Channel Created')
    .addFields({ name: 'Channel', value: `\`${channel.name}\`` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'cv', description: 'Create a voice channel.', usage: 'cv <name>' };