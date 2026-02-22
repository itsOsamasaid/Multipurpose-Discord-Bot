const path     = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  if (!userdata[message.author.id]) return tools.error(message, "You don't have an account yet.", client);

  const sorted = Object.entries(userdata)
    .filter(([, d]) => d && typeof d.xp === 'number')
    .sort(([, a], [, b]) => b.xp - a.xp)
    .slice(0, 10);

  const rows = sorted.map(([id, d], i) =>
    `**${i + 1}.** ${d.username || id} — Level \`${d.level}\` — XP \`${d.xp}\``
  ).join('\n') || 'No data yet.';

  const self = userdata[message.author.id];
  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':trophy: XP Leaderboard')
    .setDescription(rows)
    .addFields({
      name: 'Your Position',
      value: `Level \`${self.level}\` — XP \`${self.xp}\``
    });
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'leaderboard',
  description: 'View the top 10 XP leaderboard.',
  usage: 'leaderboard'
};