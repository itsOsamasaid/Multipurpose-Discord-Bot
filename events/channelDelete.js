const { EmbedBuilder, ChannelType } = require('discord.js');
const path = require('path');
const log  = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, channel) => {
  if (!channel.guild) return;
  if (!log[channel.guild.id]?.logchannel) return;
  const logc = channel.guild.channels.cache.get(log[channel.guild.id].logchannel);
  if (!logc) return;

  let title = ':wastebasket: Channel Deleted';
  if (channel.type === ChannelType.GuildText)  title = ':wastebasket: Text Channel Deleted';
  if (channel.type === ChannelType.GuildVoice) title = ':wastebasket: Voice Channel Deleted';

  const embed = client.tools.brandedEmbed(client, 'error')
    .setTitle(title)
    .addFields(
      { name: 'Channel Name', value: `\`\`\`${channel.name}\`\`\`` },
      { name: 'Channel ID',   value: channel.id }
    );

  logc.send({ embeds: [embed] });
};