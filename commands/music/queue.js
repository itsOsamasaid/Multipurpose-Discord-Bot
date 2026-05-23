exports.run = (client, message, args, tools) => {
  const queue = tools.musicGuard(message, client);
  if (!queue) return;

  const current = queue.currentTrack;
  const tracks  = queue.tracks.toArray();
  const pageSize = 10;
  let page = 0;

  const buildEmbed = () => {
    const slice = tracks.slice(page * pageSize, (page + 1) * pageSize);
    const rows  = slice.map((t, i) =>
      `**${page * pageSize + i + 1}.** ${t.title} \`${t.duration}\` — ${t.requestedBy.tag}`
    ).join('\n') || 'Queue is empty after this track.';

    return tools.brandedEmbed(client, 'info')
      .setTitle(`:notes: Queue — ${message.guild.name}`)
      .addFields({ name: '▶️ Now Playing', value: `${current.title} \`${current.duration}\`` })
      .setDescription(rows)
      .setFooter({ text: `Page ${page + 1}/${Math.max(1, Math.ceil(tracks.length / pageSize))} • ${tracks.length} tracks in queue` });
  };

  if (tracks.length <= pageSize) return message.channel.send({ embeds: [buildEmbed()] });

  message.channel.send({ embeds: [buildEmbed()] }).then(msg => {
    msg.react('◀').then(() => msg.react('▶')).catch(() => {});
    const filter    = (r, u) => ['◀','▶'].includes(r.emoji.name) && u.id === message.author.id;
    const collector = msg.createReactionCollector({ filter, time: 60000 });
    collector.on('collect', (r, u) => {
      r.users.remove(u.id).catch(() => {});
      if (r.emoji.name === '◀') page = Math.max(0, page - 1);
      if (r.emoji.name === '▶') page = Math.min(Math.ceil(tracks.length / pageSize) - 1, page + 1);
      msg.edit({ embeds: [buildEmbed()] }).catch(() => {});
    });
    collector.on('end', () => msg.reactions.removeAll().catch(() => {}));
  });
};

exports.help = { name: 'queue', description: 'View the current queue.', usage: 'queue' };