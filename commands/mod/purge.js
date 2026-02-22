const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages))
    return tools.error(message, 'You need `MANAGE_MESSAGES` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages))
    return tools.error(message, 'I need `MANAGE_MESSAGES` permission.', client);

  const amount = parseInt(args[0]);
  if (!args[0] || isNaN(amount) || amount < 1 || amount > 100)
    return tools.error(message, 'Please provide a number between 1 and 100. Usage: `purge <amount>`', client);

  // +1 to include the command message itself
  const deleted = await message.channel.bulkDelete(amount + 1, true).catch(() => null);
  if (!deleted) return tools.error(message, 'Failed to delete messages. Messages older than 14 days cannot be bulk deleted.', client);

  const count = deleted.size - 1;
  const confirm = await message.channel.send({ embeds: [
    tools.brandedEmbed(client, 'success')
      .setTitle(':wastebasket: Messages Purged')
      .addFields({ name: 'Deleted', value: `\`${count}\` messages` })
  ]});

  setTimeout(() => confirm.delete().catch(() => {}), 5000);
};

exports.help = { name: 'purge', description: 'Bulk delete messages.', usage: 'purge <1-100>' };