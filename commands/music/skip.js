exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);

  const track = queue.currentTrack;
  queue.node.skip();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':track_next: Skipped')
    .setDescription(`Skipped **${track.title}**.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'skip', aliases: ['sk'], description: 'Skip the current song.', usage: 'skip' };