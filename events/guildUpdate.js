const path = require('path');
const log  = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, oldGuild, newGuild) => {
  if (oldGuild.name === newGuild.name) return;
  if (!log[newGuild.id]?.logchannel) return;
  const logc = newGuild.channels.cache.get(log[newGuild.id].logchannel);
  if (!logc) return;

  const embed = client.tools.brandedEmbed(client, 'warning')
    .setTitle(':card_index: Server Updated')
    .addFields(
      { name: 'Old Name',  value: `\`\`\`${oldGuild.name}\`\`\``, inline: true },
      { name: 'New Name',  value: `\`\`\`${newGuild.name}\`\`\``, inline: true },
      { name: 'Server ID', value: newGuild.id }
    );

  logc.send({ embeds: [embed] });
};