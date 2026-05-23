const { QueryType } = require('discord-player');

exports.run = async (client, message, args, tools) => {
  if (!tools.voiceGuard(message, client)) return;
  if (!args.length)
    return tools.error(message, "Please provide a search query. Usage: `search <song>`", client);

  const query  = args.join(' ');
  const result = await client.player.search(query, {
    requestedBy: message.author,
    searchEngine: QueryType.YOUTUBE_SEARCH,
  }).catch(() => null);

  if (!result || !result.tracks.length)
    return tools.error(message, `No results found for \`${query}\`.`, client);

  const top5 = result.tracks.slice(0, 5);
  const rows  = top5.map((t, i) => `**${i + 1}.** ${t.title} \`${t.duration}\``).join('\n');

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(`:mag: Search Results for: ${query}`)
    .setDescription(rows + '\n\nType a number (1-5) to pick a song.');
  const msg = await message.channel.send({ embeds: [embed] });

  const filter = m => m.author.id === message.author.id && /^[1-5]$/.test(m.content.trim());
  const coll   = await message.channel.awaitMessages({ filter, max: 1, time: 20000 }).catch(() => null);

  if (!coll || !coll.size) {
    msg.edit({ embeds: [tools.brandedEmbed(client, 'error').setTitle('Search cancelled — timed out.')] });
    return;
  }

  const track = top5[parseInt(coll.first().content.trim()) - 1];
  coll.first().delete().catch(() => {});

  const node = client.player.nodes.create(message.guild, {
    metadata: { channel: message.channel },
    selfDeaf: true, volume: 80,
    leaveOnEmpty: true, leaveOnEmptyCooldown: 30000,
    leaveOnEnd: true,  leaveOnEndCooldown: 30000,
  });

  if (!node.connection) await node.connect(message.member.voice.channel).catch(() => null);
  node.addTrack(track);
  if (!node.isPlaying()) await node.play().catch(() => null);

  msg.edit({ embeds: [
    tools.brandedEmbed(client, 'success')
      .setTitle(':musical_note: Track Queued')
      .setThumbnail(track.thumbnail)
      .addFields(
        { name: 'Title',    value: track.title,    inline: true },
        { name: 'Duration', value: track.duration, inline: true }
      )
  ]});
};

exports.help = { name: 'search', aliases: ['sr'], description: 'Search and pick a song.', usage: 'search <query>' };