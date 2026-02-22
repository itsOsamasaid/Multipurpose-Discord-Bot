const { QueueRepeatMode } = require('discord-player');

exports.run = (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);

  const mode = args[0]?.toLowerCase();

  // Cycle: off → track → queue → off
  let newMode, label;
  if (mode === 'queue') {
    newMode = queue.repeatMode === QueueRepeatMode.QUEUE ? QueueRepeatMode.OFF : QueueRepeatMode.QUEUE;
    label   = newMode === QueueRepeatMode.QUEUE ? '🔁 Queue loop **enabled**.' : '🔁 Queue loop **disabled**.';
  } else if (mode === 'track' || !mode) {
    newMode = queue.repeatMode === QueueRepeatMode.TRACK ? QueueRepeatMode.OFF : QueueRepeatMode.TRACK;
    label   = newMode === QueueRepeatMode.TRACK ? '🔂 Track loop **enabled**.' : '🔂 Track loop **disabled**.';
  } else {
    return tools.error(message, 'Usage: `loop [track|queue]`', client);
  }

  queue.setRepeatMode(newMode);

  const embed = tools.brandedEmbed(client, 'info').setTitle(':repeat: Loop').setDescription(label);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'loop', aliases: ['lp','repeat'], description: 'Toggle loop mode.', usage: 'loop [track|queue]' };