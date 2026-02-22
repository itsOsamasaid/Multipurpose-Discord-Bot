const { PermissionFlagsBits } = require('discord.js');

exports.run = (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))
    return tools.error(message, ':lock: I need `EMBED_LINKS` permission.', client);
  if (!args.length) return tools.error(message, 'Usage: `embed <text>`', client);

  const embed = tools.brandedEmbed(client)
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setDescription(args.join(' '));

  message.delete().catch(() => {});
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'embed', description: 'Send text as an embed.', usage: 'embed <text>' };