const FILTERS = [
  'bassboost_low','bassboost','bassboost_high','nightcore','vaporwave',
  '8d','surrounding','pulsator','soft','tv','treble','normalizer',
  'karaoke','flanger','gate','haas','reverse','phaser','tremolo','vibrato','earrape'
];

exports.run = (client, message, args, tools) => {
  const queue = tools.musicGuard(message, client);
  if (!queue) return;

  const activeFilters = queue.filters.ffmpeg.filters;

  const rows = FILTERS.map(f =>
    `${activeFilters.includes(f) ? '✅' : '❌'} \`${f}\``
  );

  // Split into two columns
  const half  = Math.ceil(rows.length / 2);
  const col1  = rows.slice(0, half).join('\n');
  const col2  = rows.slice(half).join('\n');

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':control_knobs: Audio Filters')
    .setDescription(`Use \`filter <name>\` to toggle a filter.`)
    .addFields(
      { name: 'Filters',  value: col1, inline: true },
      { name: '\u200b',   value: col2, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'w-filters', aliases: ['filters'], description: 'View all audio filters.', usage: 'w-filters' };