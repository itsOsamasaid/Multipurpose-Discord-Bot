exports.run = (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;

  function timeCon(time) {
    let d = Math.floor(time % 31536000 / 86400);
    let h = Math.floor(time % 31536000 % 86400 / 3600);
    let m = Math.floor(time % 31536000 % 86400 % 3600 / 60);
    let s = Math.round(time % 31536000 % 86400 % 3600 % 60);
    d = d > 9 ? d : '0' + d;
    h = h > 9 ? h : '0' + h;
    m = m > 9 ? m : '0' + m;
    s = s > 9 ? s : '0' + s;
    return `${d > 0 ? `${d}d ` : ''}${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  }

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(`${client.config.branding.name} — Stats`)
    .addFields(
      { name: '⏱ Uptime',        value: timeCon(process.uptime()),                                 inline: true },
      { name: '🏓 Ping',          value: `${Date.now() - message.createdTimestamp}ms`,               inline: true },
      { name: '💾 RAM',           value: `${(process.memoryUsage().rss / 1048576).toFixed(1)}MB`,    inline: true },
      { name: '🏠 Servers',       value: `${client.guilds.cache.size}`,                              inline: true },
      { name: '📢 Channels',      value: `${client.channels.cache.size}`,                            inline: true },
      { name: '👥 Users',         value: `${client.users.cache.size}`,                               inline: true },
      { name: '🏷 Tag',           value: client.user.tag,                                            inline: true },
      { name: '🆔 Bot ID',        value: client.user.id,                                             inline: true },
      { name: '📦 Version',       value: client.config.branding.version,                             inline: true }
    );

  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'stats',
  description: 'Bot statistics (owner only).',
  usage: 'stats'
};