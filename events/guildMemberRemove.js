const path = require('path');
const log  = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, member) => {
  if (!log[member.guild.id]?.logchannel) return;
  const logc = member.guild.channels.cache.get(log[member.guild.id].logchannel);
  if (!logc) return;

  const embed = client.tools.brandedEmbed(client, 'error')
    .setTitle(':outbox_tray: Member Left')
    .setThumbnail(member.user.displayAvatarURL())
    .addFields(
      { name: 'User',    value: member.user.tag, inline: true },
      { name: 'User ID', value: member.id,       inline: true }
    );

  logc.send({ embeds: [embed] });
};