exports.run = (client, message, args, tools) => {
  const queue = tools.musicGuard(message, client);
  if (!queue) return;
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