const { PermissionFlagsBits } = require('discord.js');

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return tools.error(message, "You Don't Have `MANAGE_ROLES` Permission", client);

  let muteRole = message.guild.roles.cache.find(r => r.name === 'muted');
  let mutedMembers = muteRole ? muteRole.members.map(m => m.user.tag) : [];

  if (mutedMembers.length) {
    mutedMembers = mutedMembers.map((l, i) => `**${i + 1}.** ${l}`);
    const embed = tools.brandedEmbed(client, 'warning')
      .setTitle(':mute: Muted Users')
      .setDescription(mutedMembers.join('\n'))
    message.channel.send({ embeds: [embed] }).catch(() => {});
  } else {
    tools.error(message, 'No one is currently muted in this server.', client);
  }
};

exports.help = {
  name: 'mutelist',
  description: 'List all muted members.',
  usage: 'mutelist'
};