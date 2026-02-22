exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);
  if (queue.node.isPaused())
    return tools.error(message, "Music is already paused!", client);

  queue.node.pause();

  const embed = tools.brandedEmbed(client, 'warning')
    .setTitle(':pause_button: Paused')
    .setDescription(`Paused **${queue.currentTrack.title}**.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'pause', description: 'Pause the current song.', usage: 'pause' };