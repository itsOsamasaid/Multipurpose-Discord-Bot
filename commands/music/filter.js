const { EqualizerConfigurationPreset } = require('discord-player');

// Available filter presets in discord-player v6
const FILTERS = [
  'bassboost_low', 'bassboost', 'bassboost_high',
  'nightcore', 'vaporwave', '8d', 'surrounding',
  'pulsator', 'soft', 'tv', 'treble', 'normalizer',
  'karaoke', 'flanger', 'gate', 'haas', 'reverse',
  'phaser', 'tremolo', 'vibrato', 'earrape'
];

exports.run = async (client, message, args, tools) => {
  const queue = client.player.nodes.get(message.guild.id);
  if (!message.member.voice.channel)
    return tools.error(message, "You're not in a voice channel!", client);
  if (!queue || !queue.isPlaying())
    return tools.error(message, "No music is currently playing!", client);

  if (!args[0]) {
    const list = FILTERS.map(f => `\`${f}\``).join(', ');
    return message.channel.send({ embeds: [
      tools.brandedEmbed(client, 'info')
        .setTitle(':control_knobs: Available Filters')
        .setDescription(list + '\n\nUsage: `filter <name>`')
    ]});
  }

  const name = args[0].toLowerCase();
  if (!FILTERS.includes(name))
    return tools.error(message, `Unknown filter \`${name}\`. Use \`filter\` to see all available filters.`, client);

  // Toggle filter via FFmpegFilters
  const current = queue.filters.ffmpeg.filters;
  const enabled  = current.includes(name);

  if (enabled) {
    queue.filters.ffmpeg.setFilters(current.filter(f => f !== name));
  } else {
    queue.filters.ffmpeg.setFilters([...current, name]);
  }

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':control_knobs: Filter Updated')
    .addFields(
      { name: 'Filter', value: `\`${name}\``,               inline: true },
      { name: 'Status', value: enabled ? 'Disabled' : 'Enabled', inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'filter', description: 'Toggle an audio filter.', usage: 'filter [name]' };