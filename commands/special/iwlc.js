const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/iwlc.json');

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);

  const db      = require(dbPath);
  const gData   = db[message.guild.id] ?? {};
  const channel = message.guild.channels.cache.get(gData.iwlcchannel);

  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(':performing_arts: Image Welcome Status')
    .addFields(
      { name: 'Channel', value: channel ? `${channel}` : '`Not set`', inline: true },
      { name: 'Toggle',  value: `\`${gData.iwlctoggle ?? false}\``,   inline: true }
    )
    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'iwlc', description: 'View image welcome status.', usage: 'iwlc' };