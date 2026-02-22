exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;
  if (!args[0]) return tools.error(message, 'Please provide a Guild ID. Usage: `gjoin <guildId>`', client);

  const guild = client.guilds.cache.get(args[0]);
  if (!guild) return tools.error(message, `Bot is not in guild \`${args[0]}\`.`, client);

  const invites = await guild.invites.fetch().catch(() => null);
  if (!invites || !invites.size)
    return tools.error(message, `No invites found for **${guild.name}**.`, client);

  const rows = invites.map(inv => {
    const uses = inv.maxUses ? `${inv.uses}/${inv.maxUses}` : `${inv.uses}`;
    return `[${inv.code}](${inv.url}) — ${inv.inviter?.tag ?? 'Unknown'} — \`${uses}\``;
  }).join('\n').slice(0, 4000);

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(`:comet: ${guild.name} — Invites`)
    .setThumbnail(guild.iconURL())
    .setDescription(rows);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'gjoin', description: 'View invites for a guild (owner only).', usage: 'gjoin <guildId>' };