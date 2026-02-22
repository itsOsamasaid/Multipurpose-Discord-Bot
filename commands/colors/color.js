const { PermissionFlagsBits } = require('discord.js');

exports.run = (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles))
    return tools.error(message, ':lock: I need `MANAGE_ROLES` permission.', client);

  const num = args[0];
  if (!num || isNaN(num)) return tools.error(message, 'Please provide a color number. Usage: `color <number>`', client);

  const role = message.guild.roles.cache.find(r => r.name === `${num}`);
  if (!role) return tools.error(message, `No color found with number **${num}**. :x:`, client);

  // Remove all existing color roles from the member
  const colorRoles = message.member.roles.cache.filter(r => !isNaN(r.name));
  message.member.roles.remove(colorRoles).catch(() => {});

  // Add the chosen color role
  message.member.roles.add(role).then(() => {
    const embed = tools.brandedEmbed(client, 'success')
      .setTitle(':art: Color Changed!')
      .setDescription(`Your color has been set to **#${role.hexColor}**`)
      .setColor(role.hexColor)
      .addFields({ name: 'Color Number', value: `\`${num}\``, inline: true });
    message.channel.send({ embeds: [embed] });
  }).catch(() => tools.error(message, 'Failed to assign color role.', client));
};

exports.help = {
  name: 'color',
  description: 'Pick a color role by number.',
  usage: 'color <number>'
};