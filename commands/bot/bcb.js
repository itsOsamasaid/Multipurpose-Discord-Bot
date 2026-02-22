// bcb — broadcast to all bot users (owner only)
exports.run = (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;
  if (!args.length) return tools.error(message, 'Please write a message.', client);

  const text = args.join(' ');
  const embed = tools.brandedEmbed(client)
    .setTitle(':mega: Broadcast')
    .setDescription(text);

  let sent = 0;
  client.users.cache
    .filter(u => !u.bot)
    .forEach(u => u.send({ embeds: [embed] }).then(() => sent++).catch(() => {}));

  tools.success(message, `Broadcast sent to **${client.users.cache.filter(u => !u.bot).size}** users.`, client);
};

exports.help = {
  name: 'bcb',
  description: 'Broadcast a message to all bot users (owner only).',
  usage: 'bcb <message>'
};