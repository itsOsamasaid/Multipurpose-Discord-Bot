exports.run = (client, message, args, tools) => {
  const queue = tools.musicGuard(message, client);
  if (!queue) return;
  if (queue.tracks.size < 2)
    return tools.error(message, "Not enough tracks in queue to shuffle.", client);

  queue.tracks.shuffle();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':twisted_rightwards_arrows: Queue Shuffled')
    .setDescription(`Shuffled **${queue.tracks.size}** tracks.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'shuffle', aliases: ['sh'], description: 'Shuffle the queue.', usage: 'shuffle' };