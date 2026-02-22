exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;

  await message.channel.send({ embeds: [
    tools.brandedEmbed(client, 'warning').setTitle(':repeat: Restarting...')
  ]});

  // Gracefully destroy then re-login
  await client.destroy();
  await client.login(client.config.token);
};

exports.help = { name: 'restart', description: 'Restart the bot (owner only).', usage: 'restart' };