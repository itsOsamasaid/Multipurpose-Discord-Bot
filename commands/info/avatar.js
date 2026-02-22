exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first() || message.author;
  const url    = target.displayAvatarURL({ extension: 'png', size: 4096 });

  const embed = tools.brandedEmbed(client)
    .setTitle(`:frame_photo: ${target.username}'s Avatar`)
    .addFields({ name: 'Direct Link', value: `[Click Here](${url})` })
    .setImage(url)
    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'avatar', description: "View a member's avatar.", usage: 'avatar [@member]' };