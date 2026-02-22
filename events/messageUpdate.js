const path = require('path');
const log  = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, oldMessage, newMessage) => {
  if (oldMessage.content === newMessage.content) return;
  if (!newMessage.guild) return;
  if (!log[newMessage.guild.id]?.logchannel) return;
  const logc = newMessage.guild.channels.cache.get(log[newMessage.guild.id].logchannel);
  if (!logc) return;

  const embed = client.tools.brandedEmbed(client, 'warning')
    .setTitle(':pencil: Message Edited')
    .setURL(newMessage.url)
    .addFields(
      { name: 'Before', value: `\`\`\`${oldMessage.content?.slice(0, 1020) || '[unknown]'}\`\`\``, inline: true },
      { name: 'After',  value: `\`\`\`${newMessage.content?.slice(0, 1020) || '[unknown]'}\`\`\``, inline: true },
      { name: 'Author', value: newMessage.author?.tag ?? 'Unknown', inline: true },
      { name: 'Channel',value: `${newMessage.channel}`,            inline: true }
    );

  logc.send({ embeds: [embed] });
};