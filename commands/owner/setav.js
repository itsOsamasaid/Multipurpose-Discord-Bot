exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;

  const url = args[0] || message.attachments.first()?.url;
  if (!url) return tools.error(message, 'Provide an image URL or attach an image. Usage: `setav <url>`', client);

  await client.user.setAvatar(url).catch(() => null);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':frame_photo: Avatar Updated')
    .setImage(client.user.displayAvatarURL({ size: 256 }));
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'setav', description: "Set bot's avatar (owner only).", usage: 'setav <url>' };