const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/wlc.json');

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);

  const db    = require(dbPath);
  const gData = db[message.guild.id] ?? {};
  const ch    = message.guild.channels.cache.get(gData.wlcchannel);

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':page_with_curl: Welcome Status')
    .addFields(
      { name: 'Channel',    value: ch ? `${ch}` : '`Not set`',                  inline: true },
      { name: 'Toggle',     value: `\`${gData.wlctoggle ?? false}\``,            inline: true },
      { name: 'DM Toggle',  value: `\`${gData.wlcdm ?? false}\``,               inline: true },
      { name: 'Message',    value: gData.wlcmsg ? `\`${gData.wlcmsg}\`` : '`Not set`' }
    )
    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'wlc', description: 'View welcome system status.', usage: 'wlc' };