const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuild))
    return tools.error(message, ':lock: I need `MANAGE_GUILD` permission.', client);

  const target   = message.mentions.users.first() || message.author;
  const invites  = await message.guild.invites.fetch().catch(() => null);
  if (!invites) return tools.error(message, 'Could not fetch invites.', client);

  const total = invites
    .filter(inv => inv.inviter?.id === target.id)
    .reduce((sum, inv) => sum + inv.uses, 0);

  if (!total)
    return tools.error(message, `**${target.username}** has no recorded invites.`, client);

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':chart_with_upwards_trend: Invite Count')
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: 'User',   value: target.tag,     inline: true },
      { name: 'Invites',value: `\`${total}\``,  inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'invs', description: "View a member's total invites.", usage: 'invs [@member]' };