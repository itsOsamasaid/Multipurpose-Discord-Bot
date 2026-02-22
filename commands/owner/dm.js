exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;

  const userId = args[0];
  const text   = args.slice(1).join(' ');

  if (!userId) return tools.error(message, 'Please provide a user ID. Usage: `dm <userId> <message>`', client);
  if (!text)   return tools.error(message, 'Please provide a message.', client);

  const user = await client.users.fetch(userId).catch(() => null);
  if (!user) return tools.error(message, `Could not find user with ID \`${userId}\`.`, client);

  await user.send(text).catch(() => null);
  tools.success(message, `:comet: Message sent to **${user.tag}**.`, client);
};

exports.help = { name: 'dm', description: 'DM a user by ID (owner only).', usage: 'dm <userId> <message>' };