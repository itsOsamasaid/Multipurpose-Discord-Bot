const { AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const path   = require('path');

const config   = require(path.join(__dirname, '../database/config.json'));
const autorole = require(path.join(__dirname, '../database/autorole.json'));
const iwlc     = require(path.join(__dirname, '../database/iwlc.json'));
const wlc      = require(path.join(__dirname, '../database/wlc.json'));
const log      = require(path.join(__dirname, '../database/log.json'));

module.exports = async (client, member) => {

  // ── Welcome message ─────────────────────────────────────────
  if (wlc[member.guild.id]?.wlctoggle) {
    const wlcc = member.guild.channels.cache.get(wlc[member.guild.id].wlcchannel);
    if (wlcc && wlc[member.guild.id].wlcmsg) {
      const msg = wlc[member.guild.id].wlcmsg
        .replace('<server>', member.guild.name)
        .replace('<user>', member.user.username)
        .replace('<count>', member.guild.memberCount);
      wlcc.send({ embeds: [
        client.tools.brandedEmbed(client, 'success').setDescription(msg)
      ]}).catch(() => {});
    }
    if (wlc[member.guild.id].wlcdm && wlc[member.guild.id].wlcmsg) {
      const dmMsg = wlc[member.guild.id].wlcmsg
        .replace('<server>', member.guild.name)
        .replace('<user>', member.user.username)
        .replace('<count>', member.guild.memberCount);
      member.send({ embeds: [
        client.tools.brandedEmbed(client, 'info').setDescription(dmMsg)
      ]}).catch(() => {});
    }
  }

  // ── Log entry ────────────────────────────────────────────────
  if (log[member.guild.id]?.logchannel) {
    const logc = member.guild.channels.cache.get(log[member.guild.id].logchannel);
    if (logc) {
      const embed = client.tools.brandedEmbed(client, 'success')
        .setTitle(':inbox_tray: Member Joined')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'User',    value: member.user.tag, inline: true },
          { name: 'User ID', value: member.id,       inline: true }
        );
      logc.send({ embeds: [embed] });
    }
  }

  // ── Auto-role ────────────────────────────────────────────────
  if (autorole[member.guild.id]?.autoroletoggle && autorole[member.guild.id].autorole) {
    const arole = member.guild.roles.cache.get(autorole[member.guild.id].autorole);
    if (arole) member.roles.add(arole).catch(() => {});
  }

  // ── Image welcome card ───────────────────────────────────────
  if (!iwlc[member.guild.id]?.iwlctoggle || !iwlc[member.guild.id].iwlcchannel) return;
  const iwlcc = member.guild.channels.cache.get(iwlc[member.guild.id].iwlcchannel);
  if (!iwlcc) return;

  try {
    const canvas = Canvas.createCanvas(800, 300);
    const ctx    = canvas.getContext('2d');
    ctx.patternQuality = 'bilinear';
    ctx.antialias      = 'subpixel';
    ctx.shadowColor    = 'rgba(0,0,0,0.4)';
    ctx.shadowOffsetY  = 2;
    ctx.shadowBlur     = 2;

    const bg = await Canvas.loadImage(path.join(__dirname, '../storage/iwlc/file.png'));
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.font      = '15px Cairo';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(`Welcome To ${member.guild.name}`, 393, 205);

    ctx.font = '38px Cairo';
    ctx.fillText(member.user.username, 482, 164);

    ctx.beginPath();
    ctx.arc(152, 152, 127, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg', size: 256 }));
    ctx.drawImage(avatar, 26, 26, 260, 255);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });
    iwlcc.send({
      content: `:sparkles: **Welcome to the server, ${member}!**`,
      files: [attachment]
    });
  } catch (e) {
    console.error('[guildMemberAdd] Canvas error:', e.message);
  }
};