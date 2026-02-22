const path     = require('path');
const textdata = require(path.join(__dirname, '../../database/text.json'));

exports.run = (client, message, args, tools) => {
  const guildData = textdata[message.guild.id];
  if (!guildData) return tools.error(message, 'No text activity data for this server yet.', client);
  if (!guildData[message.author.id]) return tools.error(message, "You don't have any text activity recorded yet.", client);

  const sorted = Object.entries(guildData)
    .filter(([, d]) => d && typeof d.xp === 'number')
    .sort(([, a], [, b]) => b.xp - a.xp)
    .slice(0, 10);

  const rows = sorted.map(([id, d], i) =>
    `**${i + 1}.** ${d.username || id} — Level \`${d.level}\` — XP \`${d.xp}\``
  ).join('\n');

  const self = guildData[message.author.id];
  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':pencil: Top Text Activity')
    .setDescription(rows)
    .addFields({ name: 'Your Stats', value: `Level \`${self.level}\` — XP \`${self.xp}\`` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'toptext', description: 'Top text activity leaderboard.', usage: 'toptext' };