const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const path = require('path');
const config = require(path.join(__dirname, '../../database/config.json'));
const log = require(path.join(__dirname, '../../database/log.json'));
const warns = require(path.join(__dirname, '../../database/warnings.json'));

exports.run = async (client, message, args, tools) => {
  let user = message.mentions.users.first();

  if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return tools.error(message, "You Don't Have `ADMINISTRATOR` Permission", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) return tools.error(message, "I Don't Have `ADMINISTRATOR` Permission", client);
  if (!user) return tools.error(message, 'Please Mention A Member :warning:', client);

  let reason = args.slice(1).join(' ');
  if (!reason) return tools.error(message, 'Write A Reason :warning:', client);

  if (!warns[message.guild.id]) warns[message.guild.id] = {};
  if (!warns[message.guild.id][user.id]) warns[message.guild.id][user.id] = { warns: 0 };

  warns[message.guild.id][user.id].warns++;

  fs.writeFile(path.join(__dirname, '../../database/warnings.json'), JSON.stringify(warns, null, 2), err => {
    if (err) console.log(err);
  });

  const auditlogchannel = log[message.guild.id]?.logchannel
    ? message.guild.channels.cache.get(log[message.guild.id].logchannel)
    : null;

  const warnCount = warns[message.guild.id][user.id].warns;

  const embed = tools.brandedEmbed(client, 'warning')
    .setTitle('User has been Warned')
    .addFields(
      { name: 'Warned User',       value: `${user}`,            inline: true },
      { name: 'Warned By',         value: `${message.author}`,  inline: true },
      { name: 'Channel',           value: `${message.channel}`, inline: true },
      { name: 'Number of Warnings',value: `**${warnCount}**`,   inline: true },
      { name: 'Reason',            value: reason,               inline: true }
    )

  message.delete().catch(() => {});
  message.channel.send({ embeds: [embed] });
  if (auditlogchannel) auditlogchannel.send({ embeds: [embed] });

  const member = message.guild.members.cache.get(user.id);
  if (!member) return;

  // ── Auto-escalation ───────────────────────────────────────
  let muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');

  // Ensure mute role exists for warn levels that need it
  if ([2, 3, 4, 6].includes(warnCount) && !muteRole) {
    try {
      muteRole = await message.guild.roles.create({ name: 'Muted', color: '#000000', permissions: [] });
      message.guild.channels.cache.forEach(async channel => {
        await channel.permissionOverwrites.edit(muteRole, {
          SendMessages: false,
          AddReactions: false,
          Speak: false
        }).catch(() => {});
      });
    } catch (e) { console.log(e.stack); }
  }

  const sendEscalation = (embedTitle, fields) => {
    const esc = tools.brandedEmbed(client, 'error').setTitle(embedTitle).addFields(fields);
    message.channel.send({ embeds: [esc] });
    if (auditlogchannel) auditlogchannel.send({ embeds: [esc] });
  };

  const applyTempMute = (time) => {
    if (!muteRole) return;
    member.roles.add(muteRole).catch(() => {});
    setTimeout(() => {
      member.roles.remove(muteRole).catch(() => {});
      const unmuteEmbed = tools.brandedEmbed(client, 'success').setTitle('User has been Unmuted').addFields({ name: 'User', value: `${user}` });
      if (auditlogchannel) auditlogchannel.send({ embeds: [unmuteEmbed] });
    }, ms(time));
  };

  if (warnCount === 2) {
    applyTempMute('5m');
    sendEscalation('User Muted (Warning 2)', [
      { name: 'User', value: `${user}`, inline: true },
      { name: 'By', value: '**AUTO ESCALATION**', inline: true },
      { name: 'Duration', value: '5 minutes', inline: true },
      { name: 'Reason', value: reason }
    ]);
  }
  if (warnCount === 3) {
    applyTempMute('15m');
    sendEscalation('User Muted (Warning 3)', [
      { name: 'User', value: `${user}`, inline: true },
      { name: 'By', value: '**AUTO ESCALATION**', inline: true },
      { name: 'Duration', value: '15 minutes', inline: true },
      { name: 'Reason', value: reason }
    ]);
  }
  if (warnCount === 4) {
    applyTempMute('1h');
    sendEscalation('User Muted (Warning 4)', [
      { name: 'User', value: `${user}`, inline: true },
      { name: 'By', value: '**AUTO ESCALATION**', inline: true },
      { name: 'Duration', value: '1 hour', inline: true },
      { name: 'Reason', value: reason }
    ]);
  }
  if (warnCount === 5) {
    member.kick(reason).catch(() => {});
    sendEscalation('User Kicked (Warning 5)', [
      { name: 'User', value: `${user}`, inline: true },
      { name: 'By', value: '**AUTO ESCALATION**', inline: true },
      { name: 'Reason', value: reason }
    ]);
  }
  if (warnCount === 6) {
    applyTempMute('1d');
    sendEscalation('User Muted (Warning 6)', [
      { name: 'User', value: `${user}`, inline: true },
      { name: 'By', value: '**AUTO ESCALATION**', inline: true },
      { name: 'Duration', value: '1 day', inline: true },
      { name: 'Reason', value: reason }
    ]);
  }
  if (warnCount >= 7) {
    member.ban({ reason }).catch(() => {});
    sendEscalation('User Banned (Warning 7+)', [
      { name: 'User', value: `${user}`, inline: true },
      { name: 'By', value: '**AUTO ESCALATION**', inline: true },
      { name: 'Reason', value: reason }
    ]);
  }
};

exports.help = {
  name: 'warn',
  description: 'Warn a member. Auto-escalates at each warning level.',
  usage: 'warn @member <reason>'
};