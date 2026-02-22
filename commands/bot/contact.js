exports.run = async (client, message, args, tools) => {
  if (!args.length) return tools.error(message, 'Please write a message. Usage: `contact <message>`', client);

  const ownerID = client.config.owner;
  const owner   = await client.users.fetch(ownerID).catch(() => null);
  if (!owner) return tools.error(message, 'Could not reach the bot owner.', client);

  const msgText = args.join(' ');

  // Send to owner
  const toOwner = tools.brandedEmbed(client, 'info')
    .setTitle(':mailbox_with_mail: New Contact Message')
    .setThumbnail(message.author.displayAvatarURL())
    .addFields(
      { name: 'From',       value: message.author.tag,        inline: true },
      { name: 'User ID',    value: message.author.id,         inline: true },
      { name: 'Server',     value: message.guild?.name ?? 'DM', inline: true },
      { name: 'Message',    value: msgText }
    );
  owner.send({ embeds: [toOwner] }).catch(() => {});

  // Confirm to sender
  tools.success(message, ':mailbox_with_mail: Your message was sent to the bot owner successfully!', client);
};

exports.help = {
  name: 'contact',
  description: 'Send a message to the bot owner.',
  usage: 'contact <message>'
};