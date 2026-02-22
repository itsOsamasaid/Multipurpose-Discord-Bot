const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuild))
    return tools.error(message, ':lock: I need `MANAGE_GUILD` permission.', client);

  const invites = await message.guild.invites.fetch().catch(() => null);
  if (!invites || !invites.size) return tools.error(message, 'No invites found in this server.', client);

  const rows = invites
    .sort((a, b) => b.uses - a.uses)
    .map(inv => {
      const uses = inv.maxUses ? `${inv.uses}/${inv.maxUses}` : `${inv.uses}`;
      return `[${inv.code}](${inv.url}) — **${inv.inviter?.tag ?? 'Unknown'}** — \`${uses}\` uses`;
    })
    .join('\n')
    .slice(0, 4000);

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(`:1234: All Server Invites (${invites.size})`)
    .setDescription(rows)
    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'topinv', description: 'View all server invites sorted by uses.', usage: 'topinv' };