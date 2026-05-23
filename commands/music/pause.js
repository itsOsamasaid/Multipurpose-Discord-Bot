exports.run = (client, message, args, tools) => {
  const queue = tools.musicGuard(message, client);
  if (!queue) return;
  if (queue.node.isPaused())
    return tools.error(message, "Music is already paused!", client);

  queue.node.pause();

  const embed = tools.brandedEmbed(client, 'warning')
    .setTitle(':pause_button: Paused')
    .setDescription(`Paused **${queue.currentTrack.title}**.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'pause', description: 'Pause the current song.', usage: 'pause' };