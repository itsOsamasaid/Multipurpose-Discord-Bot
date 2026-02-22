const { PermissionFlagsBits, ChannelType } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'You need `MANAGE_CHANNELS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'I need `MANAGE_CHANNELS` permission.', client);

  const name = args.join(' ');
  if (!name) return tools.error(message, 'يجب عليك إدخال اسم. Usage: `v2m <room name>`', client);

  const duration = 120; // seconds
  const channel  = await message.guild.channels.create({ name, type: ChannelType.GuildVoice }).catch(() => null);
  if (!channel) return tools.error(message, 'Failed to create voice channel.', client);

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':stopwatch: Temporary Voice Channel')
    .setDescription(`**\`${name}\`** will be deleted in **${duration} seconds**.`)
    .addFields({ name: 'Channel', value: `${channel}` });
  const msg = await message.channel.send({ embeds: [embed] });

  setTimeout(async () => {
    await channel.delete().catch(() => {});
    msg.edit({ embeds: [
      tools.brandedEmbed(client, 'error')
        .setTitle(':stopwatch: Temporary Voice Channel Expired')
        .setDescription(`**\`${name}\`** has been deleted. — ${message.author}`)
    ]}).catch(() => {});
  }, duration * 1000);
};

exports.help = { name: 'v2m', description: 'Create a temporary voice channel (2 min).', usage: 'v2m <name>' };