const fs   = require('fs');
const path = require('path');
const { ChannelType } = require('discord.js');

const voice   = require(path.join(__dirname, '../database/voice.json'));
const tempv   = require(path.join(__dirname, '../database/tempv.json'));
const vonline = require(path.join(__dirname, '../database/vonline.json'));
const log     = require(path.join(__dirname, '../database/log.json'));

module.exports = (client, oldState, newState) => {
  const newChannel = newState.channel;
  const oldChannel = oldState.channel;

  // ── Voice XP ────────────────────────────────────────────────
  if (!oldChannel && newChannel && !newState.member.user.bot) {
    if (!voice[newState.guild.id]) voice[newState.guild.id] = {};
    if (!voice[newState.guild.id][newState.id]) {
      voice[newState.guild.id][newState.id] = { username: newState.member.user.tag, xp: 0, level: 0 };
    }
    const userData = voice[newState.guild.id][newState.id];
    userData.xp++;
    const curLevel = Math.floor(0.2 * Math.sqrt(userData.xp));
    if (curLevel > userData.level) userData.level = curLevel;
    fs.writeFile(path.join(__dirname, '../database/voice.json'), JSON.stringify(voice, null, 2), err => { if (err) console.error(err); });
  }

  // ── Temp voice channels ──────────────────────────────────────
  if (tempv[newState.guild.id]?.tempv) {
    const tempr = newState.guild.channels.cache.get(tempv[newState.guild.id].temproom);
    if (tempr) {
      // User joined the trigger channel — create their temp room
      if (!oldChannel && newChannel?.id === tempr.id) {
        newState.guild.channels.create({
          name: newState.member.user.username,
          type: ChannelType.GuildVoice
        }).then(ch => {
          ch.setParent(tempv[newState.guild.id].tempc).catch(() => {});
          setTimeout(() => {
            newState.member.voice.setChannel(ch).catch(() => {});
          }, 500);
          tempr.permissionOverwrites.edit(newState.id, { Connect: false }).catch(() => {});
        }).catch(() => {});
      }
      // User left their temp room — delete it
      const userTempCh = newState.guild.channels.cache.find(
        c => c.name === newState.member.user.username && c.type === ChannelType.GuildVoice
      );
      if (oldChannel?.id === userTempCh?.id) {
        userTempCh.delete().catch(() => {});
        tempr.permissionOverwrites.edit(newState.id, { Connect: true }).catch(() => {});
      }
    }
  }

  // ── Voice online counter ─────────────────────────────────────
  if (vonline[newState.guild.id]?.vonline) {
    const count = newState.guild.members.cache.filter(m => m.voice.channel).size;
    vonline[newState.guild.id].vx = count;
    const vCh = newState.guild.channels.cache.get(vonline[newState.guild.id].vroom);
    if (vCh) {
      setTimeout(() => {
        const name = vonline[newState.guild.id].rname.replace('<x>', count);
        vCh.edit({ name }).catch(() => {});
      }, 150);
    }
    fs.writeFile(path.join(__dirname, '../database/vonline.json'), JSON.stringify(vonline, null, 2), err => { if (err) console.error(err); });
  }

  // ── Mute/Deafen log ──────────────────────────────────────────
  if (!log[newState.guild.id]?.logchannel) return;
  const logc = newState.guild.channels.cache.get(log[newState.guild.id].logchannel);
  if (!logc) return;

  const m1 = oldState.serverMute, m2 = newState.serverMute;
  const d1 = oldState.serverDeaf, d2 = newState.serverDeaf;
  if (m1 === m2 && d1 === d2) return;

  newState.guild.fetchAuditLogs().then(logs => {
    const executor = logs.entries.first()?.executor;
    const byField  = { name: 'By', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true };
    const userField = { name: 'User', value: newState.member.user.tag, inline: true };

    let embed;
    if (m1 === false && m2 === true) {
      embed = client.tools.brandedEmbed(client, 'error')
        .setTitle(':microphone2: :x: Server Muted')
        .setDescription(`${newState.member} was muted in ${newState.guild.name}`)
        .addFields(userField, byField);
    } else if (m1 === true && m2 === false) {
      embed = client.tools.brandedEmbed(client, 'success')
        .setTitle(':microphone2: Server Unmuted')
        .setDescription(`${newState.member} was unmuted in ${newState.guild.name}`)
        .addFields(userField, byField);
    } else if (d1 === false && d2 === true) {
      embed = client.tools.brandedEmbed(client, 'error')
        .setTitle(':mute: Server Deafened')
        .setDescription(`${newState.member} was deafened in ${newState.guild.name}`)
        .addFields(userField, byField);
    } else if (d1 === true && d2 === false) {
      embed = client.tools.brandedEmbed(client, 'success')
        .setTitle(':loud_sound: Server Undeafened')
        .setDescription(`${newState.member} was undeafened in ${newState.guild.name}`)
        .addFields(userField, byField);
    }

    if (embed) logc.send({ embeds: [embed] });
  }).catch(() => {});
};