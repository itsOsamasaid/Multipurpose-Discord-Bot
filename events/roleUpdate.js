const { AuditLogEvent } = require('discord.js');
const path = require('path');
const log  = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, oldRole, newRole) => {
  if (oldRole.name === newRole.name) return;
  try {
    if (!log[newRole.guild.id]?.logchannel) return;
    const logc = newRole.guild.channels.cache.get(log[newRole.guild.id].logchannel);
    if (!logc) return;

    newRole.guild.fetchAuditLogs({ type: AuditLogEvent.RoleUpdate }).then(logs => {
      const executor = logs.entries.first()?.executor;
      const embed = client.tools.brandedEmbed(client, 'warning')
        .setTitle(':arrows_counterclockwise: Role Updated')
        .addFields(
          { name: 'Old Name',   value: `\`\`\`${oldRole.name}\`\`\``, inline: true },
          { name: 'New Name',   value: `\`\`\`${newRole.name}\`\`\``, inline: true },
          { name: 'Updated By', value: executor ? `<@${executor.id}>` : 'Unknown' }
        );
      logc.send({ embeds: [embed] }).catch(() => {});
    }).catch(() => {});
  } catch (_) {}
};