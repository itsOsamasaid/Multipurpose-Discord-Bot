module.exports = (client) => {
  client.player.events.on('playerStart', (queue, track) => {
    const channel = queue.metadata?.channel;
    if (!channel) return;

    const embed = client.tools?.brandedEmbed
      ? client.tools.brandedEmbed(client, 'success')
          .setTitle(':musical_note: Now Playing')
          .setThumbnail(track.thumbnail)
          .setURL(track.url)
          .addFields(
            { name: 'Title',    value: track.title,    inline: true },
            { name: 'Duration', value: track.duration, inline: true },
            { name: 'Requested by', value: track.requestedBy?.tag ?? 'Unknown', inline: true }
          )
      : null;

    if (embed) channel.send({ embeds: [embed] }).catch(() => {});
    else channel.send(`🎵 Now playing **${track.title}**`).catch(() => {});
  });
};