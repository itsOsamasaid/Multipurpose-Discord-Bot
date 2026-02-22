exports.run = (client, message, args, tools) => {
  const icon = message.guild.iconURL({ extension: 'png', size: 4096 });
  if (!icon) return tools.error(message, 'This server has no icon.', client);

  const embed = tools.brandedEmbed(client)
    .setTitle(`:frame_photo: ${message.guild.name} Icon`)
    .setImage(icon)
    .setURL(icon)
    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'sicon', description: 'View the server icon.', usage: 'sicon' };