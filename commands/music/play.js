const { QueryType, GuildQueueEvent } = require('discord-player');

exports.run = async (client, message, args, tools) => {
  if (!tools.voiceGuard(message, client)) return;

  if (!args.length)
    return tools.error(message, "Please provide a song name or URL. Usage: `play <song>`", client);

  const query = args.join(' ');
  await message.channel.sendTyping().catch(() => {});

  const searchResult = await client.player.search(query, {
    requestedBy: message.author,
    searchEngine: QueryType.AUTO,
  }).catch(err => {
    console.error('[Music] Search error:', err.message);
    return null;
  });

  if (!searchResult || !searchResult.tracks.length)
    return tools.error(message, `No results found for \`${query}\`.`, client);

  // Get or create the guild queue node
  const { track, searchResult: sr } = await client.player.play(
    message.member.voice.channel,
    searchResult,
    {
      nodeOptions: {
        metadata: { channel: message.channel },
        selfDeaf: true,
        volume: 80,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 30000,
      }
    }
  ).catch(err => {
    console.error('[Music] Play error:', err.message);
    tools.error(message, `Failed to play: \`${err.message}\``, client);
    return {};
  });

  if (!track) return;

  const isPlaylist = searchResult.playlist;
  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(isPlaylist ? ':musical_note: Playlist Queued' : ':musical_note: Track Queued')
    .setThumbnail(searchResult.tracks[0].thumbnail)
    .addFields(
      { name: 'Title',        value: isPlaylist ? searchResult.playlist.title : searchResult.tracks[0].title, inline: true },
      { name: 'Duration',     value: isPlaylist ? `${searchResult.tracks.length} tracks` : searchResult.tracks[0].duration, inline: true },
      { name: 'Requested by', value: message.author.tag, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'play', aliases: ['p'], description: 'Play a song or playlist.', usage: 'play <song/URL>' };