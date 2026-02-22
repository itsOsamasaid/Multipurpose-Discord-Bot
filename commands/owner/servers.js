exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;

  const guilds  = [...client.guilds.cache.values()];
  const pageSize = 5;
  let page = 0;

  const buildEmbed = () => {
    const slice = guilds.slice(page * pageSize, (page + 1) * pageSize);
    const rows  = slice.map((g, i) =>
      `**${page * pageSize + i + 1}.** ${g.name} — \`${g.id}\` — Members: \`${g.memberCount}\``
    ).join('\n');

    return tools.brandedEmbed(client, 'info')
      .setTitle(`:comet: Bot Servers (${guilds.length} total)`)
      .setDescription(rows)
      .setFooter({ text: `Page ${page + 1} of ${Math.ceil(guilds.length / pageSize)}`, iconURL: client.user.displayAvatarURL() });
  };

  if (guilds.length <= pageSize) {
    return message.channel.send({ embeds: [buildEmbed()] });
  }

  const msg = await message.channel.send({ embeds: [buildEmbed()] });
  await msg.react('◀').catch(() => {});
  await msg.react('▶').catch(() => {});

  const filter    = (r, u) => ['◀','▶'].includes(r.emoji.name) && u.id === message.author.id;
  const collector = msg.createReactionCollector({ filter, time: 60000 });

  collector.on('collect', (r, u) => {
    r.users.remove(u.id).catch(() => {});
    if (r.emoji.name === '◀') page = Math.max(0, page - 1);
    if (r.emoji.name === '▶') page = Math.min(Math.ceil(guilds.length / pageSize) - 1, page + 1);
    msg.edit({ embeds: [buildEmbed()] }).catch(() => {});
  });

  collector.on('end', () => msg.reactions.removeAll().catch(() => {}));
};

exports.help = { name: 'servers', description: 'List all bot servers (owner only).', usage: 'servers' };