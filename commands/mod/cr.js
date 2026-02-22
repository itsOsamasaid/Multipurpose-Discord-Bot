const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles))
    return tools.error(message, 'You need `MANAGE_ROLES` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles))
    return tools.error(message, 'I need `MANAGE_ROLES` permission.', client);
  if (!args.length) return tools.error(message, 'Usage: `cr <role name>`', client);

  const role = await message.guild.roles.create({
    name: args.join(' '),
    color: 0xd3d0c4,
    permissions: [],
  }).catch(() => null);

  if (!role) return tools.error(message, 'Failed to create role.', client);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':shield: Role Created')
    .addFields({ name: 'Role', value: `${role}`, inline: true });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'cr', description: 'Create a role.', usage: 'cr <name>' };