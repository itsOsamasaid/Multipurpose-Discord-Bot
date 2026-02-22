const { AuditLogEvent } = require('discord.js');
const path = require('path');
const log  = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, role) => {
  try {
    if (!log[role.guild.id]?.logchannel) return;
    const logc = role.guild.channels.cache.get(log[role.guild.id].logchannel);
    if (!logc) return;

    role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleCreate }).then(logs => {
      const executor = logs.entries.first()?.executor;
      const embed = client.tools.brandedEmbed(client, 'success')
        .setTitle(':sparkles: Role Created')
        .addFields(
          { name: 'Role Name', value: `\`\`\`${role.name}\`\`\``, inline: true },
          { name: 'Role ID',   value: role.id,                     inline: true },
          { name: 'Created By',value: executor ? `<@${executor.id}>` : 'Unknown' }
        );
      logc.send({ embeds: [embed] }).catch(() => {});
    }).catch(() => {});
  } catch (_) {}
};