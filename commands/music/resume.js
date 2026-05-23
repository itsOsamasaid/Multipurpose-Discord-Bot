exports.run = (client, message, args, tools) => {
  const queue = tools.musicGuard(message, client);
  if (!queue) return;
  if (!queue.node.isPaused())
    return tools.error(message, "Music is already playing!", client);

  queue.node.resume();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':arrow_forward: Resumed')
    .setDescription(`Resumed **${queue.currentTrack.title}**.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'resume', description: 'Resume paused music.', usage: 'resume' };