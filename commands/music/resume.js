exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue)
    return tools.error(message, "No music in queue!", client);
  if (!queue.node.isPaused())
    return tools.error(message, "Music is already playing!", client);

  queue.node.resume();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':arrow_forward: Resumed')
    .setDescription(`Resumed **${queue.currentTrack.title}**.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'resume', description: 'Resume paused music.', usage: 'resume' };