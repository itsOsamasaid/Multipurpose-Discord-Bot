exports.run = (client, message, args, tools) => {
  if (!message.channel.guild) return;

  const colorRoles = message.guild.roles.cache
    .filter(r => !isNaN(r.name) && r.name.trim() !== '')
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  if (!colorRoles.size)
    return tools.error(message, "No color roles found. Use `ccolors <amount>` to create them.", client);

  // Build pages of 20 colors each
  const entries = [...colorRoles.values()];
  const pageSize = 20;
  const pageCount = Math.ceil(entries.length / pageSize);
  let page = 0;

  const buildEmbed = () => {
    const slice = entries.slice(page * pageSize, (page + 1) * pageSize);
    const rows  = slice.map(r => `**${r.name}** — \`${r.hexColor}\``).join('\n');
    return tools.brandedEmbed(client, 'info')
      .setTitle(':art: Server Color List')
      .setDescription(rows)
      .setFooter({ text: `Page ${page + 1} of ${pageCount} • Use ${client.config.prefix}color <number> to pick`, iconURL: client.user.displayAvatarURL() });
  };

  if (pageCount === 1) {
    return message.channel.send({ embeds: [buildEmbed()] });
  }

  message.channel.send({ embeds: [buildEmbed()] }).then(msg => {
    msg.react('◀').then(() => msg.react('▶')).catch(() => {});

    const filter = (reaction, user) => ['◀','▶'].includes(reaction.emoji.name) && user.id === message.author.id;
    const collector = msg.createReactionCollector({ filter, time: 60000 });

    collector.on('collect', (reaction, user) => {
      reaction.users.remove(user.id).catch(() => {});
      if (reaction.emoji.name === '◀') page = Math.max(0, page - 1);
      if (reaction.emoji.name === '▶') page = Math.min(pageCount - 1, page + 1);
      msg.edit({ embeds: [buildEmbed()] }).catch(() => {});
    });

    collector.on('end', () => msg.reactions.removeAll().catch(() => {}));
  });
};

exports.help = {
  name: 'colors',
  description: 'View all available color roles.',
  usage: 'colors'
};