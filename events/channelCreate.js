const { EmbedBuilder, ChannelType } = require('discord.js');
const moment = require('moment');
const path   = require('path');
const log    = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, channel) => {
  if (!channel.guild) return;
  if (!log[channel.guild.id]?.logchannel) return;
  const logc = channel.guild.channels.cache.get(log[channel.guild.id].logchannel);
  if (!logc) return;

  let title = ':inbox_tray: Channel Created';
  if (channel.type === ChannelType.GuildText)  title = ':pencil: Text Channel Created';
  if (channel.type === ChannelType.GuildVoice) title = ':microphone2: Voice Channel Created';

  const embed = client.tools.brandedEmbed(client)
    .setTitle(title)
    .addFields(
      { name: 'Channel Name', value: `\`\`\`${channel.name}\`\`\`` },
      { name: 'Channel ID',   value: channel.id },
      { name: 'Created At',   value: moment(channel.createdAt).format('YYYY/MM/DD HH:mm:ss') }
    );

  logc.send({ embeds: [embed] });
};