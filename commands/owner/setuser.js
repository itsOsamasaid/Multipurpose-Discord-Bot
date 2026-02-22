exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;
  if (!args.length) return tools.error(message, 'Usage: `setuser <new username>`', client);

  const newName = args.join(' ');
  await client.user.setUsername(newName).catch(() => null);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':label: Username Updated')
    .addFields({ name: 'New Username', value: `\`${newName}\`` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'setuser', description: "Set bot's username (owner only).", usage: 'setuser <name>' };