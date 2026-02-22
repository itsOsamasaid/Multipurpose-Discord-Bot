const { AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const path   = require('path');

exports.run = async (client, message, args, tools) => {
  const target = message.mentions.members.first() || message.member;
  const user   = target.user;

  // ── Canvas ID card ────────────────────────────────────────
  const canvas = Canvas.createCanvas(300, 300);
  const ctx    = canvas.getContext('2d');

  // Background
  const bgPath = path.join(__dirname, '../../storage/id/id22.png');
  try {
    const bg = await Canvas.loadImage(bgPath);
    ctx.drawImage(bg, 0, 0, 300, 300);
  } catch {
    // Fallback: dark gradient background
    const grad = ctx.createLinearGradient(0, 0, 300, 300);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 300, 300);
  }

  // Avatar (circular clip)
  const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 256 });
  try {
    const avatar = await Canvas.loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 90, 45, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 105, 45, 90, 90);
    ctx.restore();
  } catch {}

  // Status dot
  const statusColors = { online: '#2ce032', dnd: '#ff0000', idle: '#f4d32e', offline: '#898988' };
  const status = target.presence?.status ?? 'offline';
  ctx.fillStyle = statusColors[status] ?? '#898988';
  ctx.beginPath();
  ctx.arc(185, 115, 10, 0, Math.PI * 2);
  ctx.fill();

  // Text helper
  const text = (str, x, y, font = 'bold 16px Arial', align = 'center', color = '#ffffff') => {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align;
    ctx.fillText(str, x, y);
  };

  text(user.username, 150, 155, 'bold 18px Arial');
  text(`ID: ${user.id}`, 150, 178, '12px Arial');
  text(`Joined Server: ${target.joinedAt?.toDateString() ?? 'Unknown'}`, 150, 220, '11px Arial');
  text(`Discord Since: ${user.createdAt.toDateString()}`, 150, 240, '11px Arial');

  const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'id-card.png' });
  message.channel.send({ files: [attachment] });
};

exports.help = { name: 'id', description: 'View a user ID card.', usage: 'id [@member]' };