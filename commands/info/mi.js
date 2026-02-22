exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first() || message.author;

  const embed = tools.brandedEmbed(client, 'info')
    .setThumbnail(target.displayAvatarURL({ size: 256 }))
    .setTitle(':bust_in_silhouette: Member Info')
    .addFields(
      { name: 'Name',       value: `<@${target.id}>`,              inline: true },
      { name: 'ID',         value: `\`${target.id}\``,             inline: true },
      { name: 'Created At', value: target.createdAt.toDateString(), inline: true },
      { name: 'Bot?',       value: target.bot ? 'Yes' : 'No',      inline: true }
    )
    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'mi', description: 'View member info.', usage: 'mi [@member]' };