const { PermissionFlagsBits } = require('discord.js');

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return tools.error(message, "You need `MANAGE_ROLES` Permission to execute `unmute`", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return tools.error(message, "I need `MANAGE_ROLES` Permission to execute `unmute`", client);

  let userUnmute = message.mentions.users.first();
  if (message.mentions.users.size < 1) return tools.error(message, 'You need to mention someone to unmute.', client);

  let muteRole = message.guild.roles.cache.find(r => r.name === 'muted');
  if (!muteRole) return tools.error(message, 'No role named **muted** found.', client);

  message.guild.members.cache.get(userUnmute.id).roles.remove(muteRole).then(() => {
    tools.success(message, `Successfully unmuted ${userUnmute}`, client);
  }).catch(() => tools.error(message, 'Failed to unmute that user.', client));
}

exports.help = {
  name: 'unmute',
  description: 'Unmute a member.',
  usage: 'unmute @member'
};