const path  = require('path');
const games = require(path.join(__dirname, '../../database/games.json'));

exports.run = (client, message, args, tools) => {
  const target = message.mentions.members.first() || message.member;

  if (!games[message.guild.id]?.[target.id])
    return tools.error(message, "This user hasn't played any games yet.", client);

  const data   = games[message.guild.id][target.id];
  const total  = data.wins + data.loses;
  const gains  = data.wins * 25;
  const winPct = total > 0 ? ((data.wins / total) * 100).toFixed(1) : '0.0';

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':chart_with_upwards_trend: Game Stats')
    .setThumbnail(target.user.displayAvatarURL())
    .addFields(
      { name: 'Player',    value: target.user.tag,  inline: true },
      { name: 'Games',     value: `\`${total}\``,   inline: true },
      { name: 'Win Rate',  value: `\`${winPct}%\``, inline: true },
      { name: ':trophy: Wins',  value: `\`${data.wins}\``,  inline: true },
      { name: ':x: Losses',    value: `\`${data.loses}\``, inline: true },
      { name: ':dollar: Gains',value: `\`${gains}$\``,     inline: true }
    );

  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'gstats',
  description: "View a member's game statistics.",
  usage: 'gstats [@member]'
};