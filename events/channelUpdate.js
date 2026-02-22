const { ChannelType } = require('discord.js');
const path    = require('path');
const log     = require(path.join(__dirname, '../database/log.json'));
const vonline = require(path.join(__dirname, '../database/vonline.json'));

module.exports = (client, oldChannel, newChannel) => {
  if (!newChannel.guild) return;
  if (oldChannel.name === newChannel.name) return;
  if (!log[newChannel.guild.id]?.logchannel) return;
  if (vonline[newChannel.guild.id]?.vroom === newChannel.id) return;

  const logc = newChannel.guild.channels.cache.get(log[newChannel.guild.id].logchannel);
  if (!logc) return;

  let title = ':pencil: Channel Updated';
  if (newChannel.type === ChannelType.GuildText)  title = ':pencil: Text Channel Updated';
  if (newChannel.type === ChannelType.GuildVoice) title = ':microphone2: Voice Channel Updated';

  const embed = client.tools.brandedEmbed(client, 'warning')
    .setTitle(title)
    .addFields(
      { name: 'Old Name',   value: `\`\`\`${oldChannel.name}\`\`\``, inline: true },
      { name: 'New Name',   value: `\`\`\`${newChannel.name}\`\`\``, inline: true },
      { name: 'Channel ID', value: newChannel.id }
    );

  logc.send({ embeds: [embed] });
};