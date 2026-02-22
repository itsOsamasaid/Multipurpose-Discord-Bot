const path     = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first() || message.author;
  if (!userdata[target.id]) return tools.error(message, "This user doesn't have an account yet.", client);

  const data = userdata[target.id];
  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':star: Level Info')
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: 'User',  value: target.tag,       inline: true },
      { name: 'Level', value: `\`${data.level}\``, inline: true },
      { name: 'XP',    value: `\`${data.xp}\``,    inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'level',
  description: "View a member's level and XP.",
  usage: 'level [@member]'
};