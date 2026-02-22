exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);

  const vol = parseInt(args[0]);
  if (!args[0] || isNaN(vol) || vol < 1 || vol > 100)
    return tools.error(message, "Please enter a valid volume between 1 and 100.", client);

  queue.node.setVolume(vol);

  const bar = '█'.repeat(Math.round(vol / 10)) + '░'.repeat(10 - Math.round(vol / 10));
  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':loud_sound: Volume Set')
    .addFields(
      { name: 'Volume', value: `\`${vol}%\``, inline: true },
      { name: 'Bar',    value: `\`${bar}\``,  inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'volume', description: 'Set volume (1-100).', usage: 'volume <1-100>' };