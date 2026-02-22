exports.run = (client, message, args, tools) => {
  const user   = message.mentions.users.first() || message.author;
  const member = message.guild.members.cache.get(user.id);

  if (!member?.presence) {
    return tools.error(message,
      'Could not read presence. Make sure the bot has the `GUILD_PRESENCES` privileged intent enabled.',
      client
    );
  }

  const spotifyActivity = member.presence.activities?.find(
    a => a.name === 'Spotify' && a.type === 2
  );

  if (!spotifyActivity) {
    return tools.error(message, `**${user.username}** is not listening to Spotify right now.`, client);
  }

  const trackName   = spotifyActivity.details ?? 'Unknown';
  const trackArtist = spotifyActivity.state?.replace(/;/g, ',') ?? 'Unknown';
  const trackAlbum  = spotifyActivity.assets?.largeText ?? 'Unknown';
  const trackImgKey = spotifyActivity.assets?.largeImage;
  const trackImg    = trackImgKey?.startsWith('spotify:')
    ? `https://i.scdn.co/image/${trackImgKey.slice(8)}`
    : null;
  const trackId     = spotifyActivity.syncId;
  const trackURL    = trackId ? `https://open.spotify.com/track/${trackId}` : null;

  const embed = tools.brandedEmbed(client)
    .setColor(0x1ED760)
    .setAuthor({ name: 'Spotify', iconURL: 'https://cdn.discordapp.com/emojis/408668371039682560.png' })
    .setTitle(`:musical_note: ${trackName}`)
    .addFields(
      { name: 'Artist', value: trackArtist, inline: true },
      { name: 'Album',  value: trackAlbum,  inline: true }
    );

  if (trackImg)  embed.setThumbnail(trackImg);
  if (trackURL)  embed.setURL(trackURL).addFields({ name: 'Listen', value: `[Open in Spotify](${trackURL})` });

  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'spotify', description: "View what a member is listening to on Spotify.", usage: 'spotify [@member]' };