const { PermissionFlagsBits, ChannelType } = require('discord.js');
const path = require('path');
const log = require(path.join(__dirname, '../../database/log.json'));

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) return tools.error(message, "You need `MUTE_MEMBERS` Permission to execute `mute`", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return tools.error(message, "I need `MANAGE_ROLES` Permission to execute `mute`", client);

  const msmute = require('ms');
  let userMute = message.mentions.users.first();
  let timeMute = args[1];
  let reasonMute = args.slice(2).join(' ');
  let muteRole = message.guild.roles.cache.find(r => r.name === 'muted');

  if (!muteRole) return tools.error(message, 'Please create a role called **muted**', client);
  if (message.mentions.users.size < 1) return tools.error(message, 'You need to mention someone to mute.', client);
  if (message.author.id === userMute.id) return tools.error(message, "You can't punish yourself :wink:", client);
  if (!timeMute) return tools.error(message, 'Specify the time. Usage: `mute @member 10m reason`', client);
  if (!timeMute.match(/[1-9][0-9]*[smhdw]/g)) return tools.error(message, 'Invalid time format. Example: `10m`, `1h`, `1d`', client);
  if (!reasonMute) return tools.error(message, 'You must give a reason. Usage: `mute @member 10m reason`', client);

  const member = message.guild.members.cache.get(userMute.id);
  member.roles.add(muteRole);

  setTimeout(() => { member.roles.remove(muteRole).catch(() => {}); }, msmute(timeMute));

  message.guild.channels.cache
    .filter(c => c.type === ChannelType.GuildText)
    .forEach(cnl => {
      cnl.permissionOverwrites.edit(muteRole, { SendMessages: false }).catch(() => {});
    });

  const embed = tools.brandedEmbed(client, 'warning')
    .setTitle('Mute')
    .addFields({ name: 'Details', value: `**Muted:** ${userMute.tag}\n**Moderator:** ${message.author.tag}\n**Duration:** ${msmute(msmute(timeMute), { long: true })}\n**Reason:** ${reasonMute}` })

  message.channel.send({ embeds: [embed] });

  const auditlogchannel = log[message.guild.id]?.logchannel
    ? message.guild.channels.cache.get(log[message.guild.id].logchannel)
    : null;
  if (auditlogchannel) auditlogchannel.send({ embeds: [embed] });
}

exports.help = {
  name: 'mute',
  description: 'Mute a member for a set duration.',
  usage: 'mute @member <time> <reason>'
};