exports.run = (client, message, args, tools) => {
  const queue = tools.musicGuard(message, client);
  if (!queue) return;

  queue.delete();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':stop_button: Stopped')
    .setDescription('Music stopped and queue cleared.');
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'stop', aliases: ['dc'], description: 'Stop music and clear queue.', usage: 'stop' };