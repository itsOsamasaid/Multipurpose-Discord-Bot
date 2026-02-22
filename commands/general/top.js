const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuild))
    return tools.error(message, ':lock: I need `MANAGE_GUILD` permission.', client);

  const invites = await message.guild.invites.fetch().catch(() => null);
  if (!invites) return tools.error(message, 'Could not fetch invites.', client);

  // Aggregate total uses per inviter
  const totals = new Map();
  invites.forEach(inv => {
    if (!inv.inviter) return;
    totals.set(inv.inviter.id, {
      tag:  inv.inviter.tag,
      uses: (totals.get(inv.inviter.id)?.uses ?? 0) + inv.uses
    });
  });

  const sorted = [...totals.values()].sort((a, b) => b.uses - a.uses).slice(0, 10);
  if (!sorted.length) return tools.error(message, 'No invite data found.', client);

  const rows = sorted.map((e, i) => `**${i + 1}.** ${e.tag} — \`${e.uses}\` invites`).join('\n');

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':link: Top Inviters')
    .setDescription(rows);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'top', description: 'Top inviters leaderboard.', usage: 'top' };