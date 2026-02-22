exports.run = async (client, message, args, tools) => {
  const user   = message.mentions.users.first() || message.author;
  const member = await message.guild.members.fetch(user.id).catch(() => null);

  const roles = member?.roles.cache
    .filter(r => r.id !== message.guild.id)
    .sort((a, b) => b.position - a.position)
    .map(r => `${r}`)
    .slice(0, 10)
    .join(', ') || 'None';

  const embed = tools.brandedEmbed(client, 'info')
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setTitle(':bust_in_silhouette: User Info')
    .addFields(
      { name: ':label: Username',         value: user.tag,                              inline: true },
      { name: ':id: User ID',             value: `\`${user.id}\``,                     inline: true },
      { name: ':robot: Bot?',             value: user.bot ? 'Yes' : 'No',              inline: true },
      { name: ':globe_with_meridians: Joined Discord', value: user.createdAt.toDateString(),   inline: true },
      { name: ':inbox_tray: Joined Server',            value: member?.joinedAt?.toDateString() ?? 'Unknown', inline: true },
      { name: ':shield: Highest Role',    value: member?.roles.highest.toString() ?? 'N/A', inline: true },
      { name: ':scroll: Roles',           value: roles,                                 inline: false }
    )
    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'ui', description: 'View user info.', usage: 'ui [@member]' };