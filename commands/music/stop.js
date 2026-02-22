exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);

  queue.delete();

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':stop_button: Stopped')
    .setDescription('Music stopped and queue cleared.');
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'stop', aliases: ['dc'], description: 'Stop music and clear queue.', usage: 'stop' };