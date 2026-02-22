exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);
  if (queue.tracks.size < 2)
    return tools.error(message, "Not enough tracks in queue to shuffle.", client);

  queue.tracks.shuffle();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':twisted_rightwards_arrows: Queue Shuffled')
    .setDescription(`Shuffled **${queue.tracks.size}** tracks.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'shuffle', aliases: ['sh'], description: 'Shuffle the queue.', usage: 'shuffle' };