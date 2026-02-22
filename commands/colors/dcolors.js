const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, "You need `ADMINISTRATOR` permission.", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles))
    return tools.error(message, "I need `MANAGE_ROLES` permission.", client);

  const colorRoles = message.guild.roles.cache.filter(r => !isNaN(r.name));
  if (!colorRoles.size) return tools.error(message, "No color roles found in this server.", client);

  const msg = await message.channel.send({ embeds: [
    tools.brandedEmbed(client, 'warning')
      .setTitle(`:wastebasket: Deleting ${colorRoles.size} color roles...`)
  ]});

  let deleted = 0;
  for (const [, role] of colorRoles) {
    await role.delete().then(() => deleted++).catch(() => {});
  }

  msg.edit({ embeds: [
    tools.brandedEmbed(client, 'success')
      .setTitle(':white_check_mark: Color Roles Deleted')
      .addFields({ name: 'Deleted', value: `\`${deleted}\`` })
  ]});
};

exports.help = {
  name: 'dcolors',
  description: 'Delete all color roles from the server.',
  usage: 'dcolors'
};