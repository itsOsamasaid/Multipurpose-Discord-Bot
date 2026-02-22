const { AuditLogEvent } = require('discord.js');
const path = require('path');
const log  = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, ban) => {
  const { guild, user } = ban;
  if (!log[guild.id]?.logchannel) return;
  const logc = guild.channels.cache.get(log[guild.id].logchannel);
  if (!logc) return;

  guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd }).then(logs => {
    const executor = logs.entries.first()?.executor;
    const embed = client.tools.brandedEmbed(client, 'error')
      .setTitle(':no_entry: Member Banned')
      .addFields(
        { name: 'User',      value: user.tag,                                    inline: true },
        { name: 'Banned By', value: executor ? `<@${executor.id}>` : 'Unknown',  inline: true }
      );
    logc.send({ embeds: [embed] });
  }).catch(() => {});
};