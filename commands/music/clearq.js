exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);
  if (queue.tracks.size === 0)
    return tools.error(message, "The queue is already empty (only current track playing).", client);

  const count = queue.tracks.size;
  queue.tracks.clear();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':wastebasket: Queue Cleared')
    .setDescription(`Removed **${count}** tracks from the queue.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'clear-queue', aliases: ['cq'], description: 'Clear the queue.', usage: 'clear-queue' };