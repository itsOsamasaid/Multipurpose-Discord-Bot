const path     = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first() || message.author;
  if (!userdata[target.id]) return tools.error(message, "This user doesn't have an account yet.", client);

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':credit_card: Balance')
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: 'User',    value: target.tag,                            inline: true },
      { name: 'Credits', value: `\`${userdata[target.id].credits}$\``, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'credits',
  description: "View a member's credit balance.",
  usage: 'credits [@member]'
};