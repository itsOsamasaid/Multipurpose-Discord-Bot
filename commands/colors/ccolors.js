const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, "You need `ADMINISTRATOR` permission.", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles))
    return tools.error(message, "I need `MANAGE_ROLES` permission.", client);

  const amount = parseInt(args[0]);
  if (!args[0] || isNaN(amount) || amount < 1 || amount > 100)
    return tools.error(message, 'Please provide a number between 1 and 100. Usage: `ccolors <amount>`', client);

  // Check if colors already exist
  const existing = message.guild.roles.cache.find(r => r.name === '1');
  if (existing) return tools.error(message, "Color roles already exist! Use `dcolors` to delete them first.", client);

  const msg = await message.channel.send({ embeds: [
    tools.brandedEmbed(client).setTitle(':hourglass_flowing_sand: Creating color roles...')
  ]});

  for (let x = 1; x <= amount; x++) {
    await message.guild.roles.create({ name: `${x}`, color: 'Random' }).catch(() => {});
  }

  msg.edit({ embeds: [
    tools.brandedEmbed(client, 'success')
      .setTitle(':art: Color Roles Created!')
      .addFields({ name: 'Roles Created', value: `\`${amount}\`` })
  ]});
};

exports.help = {
  name: 'ccolors',
  description: 'Create a set of random color roles.',
  usage: 'ccolors <amount>'
};