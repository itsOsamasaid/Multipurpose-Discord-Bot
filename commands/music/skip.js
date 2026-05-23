exports.run = (client, message, args, tools) => {
  const queue = tools.musicGuard(message, client);
  if (!queue) return;

  const track = queue.currentTrack;
  queue.node.skip();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':track_next: Skipped')
    .setDescription(`Skipped **${track.title}**.`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'skip', aliases: ['sk'], description: 'Skip the current song.', usage: 'skip' };