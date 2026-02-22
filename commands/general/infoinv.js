const moment = require('moment');
const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuild))
    return tools.error(message, ':lock: I need `MANAGE_GUILD` permission.', client);
  if (!args[0]) return tools.error(message, 'Usage: `infoinv <invite code>`', client);

  const invites = await message.guild.invites.fetch().catch(() => null);
  if (!invites) return tools.error(message, 'Could not fetch invites.', client);

  const inv = invites.get(args[0]);
  if (!inv) return tools.error(message, `No invite found with code \`${args[0]}\`.`, client);

  const uses = inv.maxUses ? `${inv.uses}/${inv.maxUses}` : `${inv.uses}`;

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':link: Invite Info')
    .addFields(
      { name: 'Code',      value: inv.code,                                                    inline: true },
      { name: 'Inviter',   value: inv.inviter?.tag ?? 'Unknown',                               inline: true },
      { name: 'Channel',   value: `${inv.channel}`,                                            inline: true },
      { name: 'Uses',      value: uses,                                                        inline: true },
      { name: 'Max Age',   value: inv.maxAge ? `${inv.maxAge}s` : 'Never expires',             inline: true },
      { name: 'Created',   value: moment(inv.createdAt).format('YYYY/MM/DD HH:mm'),            inline: true },
      { name: 'Expires',   value: inv.expiresAt ? moment(inv.expiresAt).format('YYYY/MM/DD HH:mm') : 'Never', inline: true }
    )
    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'infoinv', description: 'Get info about an invite code.', usage: 'infoinv <code>' };