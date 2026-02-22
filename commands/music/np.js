exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);

  const track    = queue.currentTrack;
  const progress = queue.node.createProgressBar();

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':musical_note: Now Playing')
    .setThumbnail(track.thumbnail)
    .setURL(track.url)
    .addFields(
      { name: 'Title',        value: track.title,                                                   inline: false },
      { name: 'Author',       value: track.author,                                                  inline: true  },
      { name: 'Duration',     value: track.duration,                                                inline: true  },
      { name: 'Requested by', value: track.requestedBy?.tag ?? 'Unknown',                          inline: true  },
      { name: 'Volume',       value: `\`${queue.node.volume}%\``,                                  inline: true  },
      { name: 'Loop',         value: queue.repeatMode === 0 ? 'Off' : queue.repeatMode === 1 ? 'Track' : 'Queue', inline: true },
      { name: 'Paused',       value: queue.node.isPaused() ? 'Yes' : 'No',                         inline: true  },
      { name: 'Progress',     value: progress || 'N/A',                                            inline: false }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'nowplaying', aliases: ['np'], description: 'Show current track.', usage: 'np' };