const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) return tools.error(message, "I Don't Have `MANAGE_MESSAGES` Permission", client);
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return tools.error(message, "You Don't Have `MANAGE_MESSAGES` Permission", client);

  const amount = parseInt(args[0]);
  if (!amount || amount < 1 || amount > 100) return tools.error(message, "Please provide a number between 1 and 100.", client);

  await message.channel.bulkDelete(amount, true).catch(() => {});

  const msg = await message.channel.send({ embeds: [
    tools.brandedEmbed(client, 'success').setTitle(`Cleared ${amount} messages!`)
  ]});
  setTimeout(() => msg.delete().catch(() => {}), 3000);
}

exports.help = {
  name: 'clear',
  description: 'Clear Channel Messages.',
  usage: 'clear <amount>'
};