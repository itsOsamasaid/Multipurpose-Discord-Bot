const path  = require('path');
const names = require(path.join(__dirname, '../../database/names.json'));

exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first() || message.author;

  if (!names[message.guild.id]?.[target.id])
    return tools.error(message, `**${target.username}** has no name history logged.`, client);

  const data  = names[message.guild.id][target.id];
  const nicks = data.nicknames  || 'None logged';
  const users = data.usernames  || 'None logged';

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':label: Name History')
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: 'User',           value: target.tag },
      { name: 'Last Nickname',  value: `\`${nicks}\`` },
      { name: 'Last Username',  value: `\`${users}\`` }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'names', description: "View a member's name history.", usage: 'names [@member]' };