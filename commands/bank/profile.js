const { AttachmentBuilder } = require('discord.js');
const Canvas  = require('canvas');
const path    = require('path');
const userdata= require(path.join(__dirname, '../../database/userdata.json'));
const guild   = require(path.join(__dirname, '../../database/guild.json'));

exports.run = async (client, message, args, tools) => {
  const target   = message.mentions.users.first() || message.author;
  const userData = userdata[target.id];
  if (!userData) return tools.error(message, "This user doesn't have an account yet.", client);
  if (!userData.cbg) return tools.error(message, "This user hasn't set a background yet. Use `setbg <number>`.", client);

  try {
    const canvas = Canvas.createCanvas(300, 300);
    const ctx    = canvas.getContext('2d');

    const background = await Canvas.loadImage(userData.cbg);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.patternQuality = 'bilinear';
    ctx.antialias      = 'subpixel';

    const avatar = await Canvas.loadImage(target.displayAvatarURL({ extension: 'jpg', size: 256 }));
    ctx.drawImage(avatar, 110, 59, 78, 78);

    ctx.font      = 'bold 15px Cairo';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(target.tag, 150, 165);

    ctx.font = 'bold 10px Cairo';
    ctx.fillText(userData.statu || `${guild[message.guild.id]?.prefix ?? client.config.prefix}setinfo`, 150, 205);

    ctx.font = 'lighter 20px Cairo';
    ctx.fillText(`${userData.reps ? '❤' : '♥'}${userData.reps || 0}`, 71, 88);

    ctx.font = 'bold 10px Cairo';
    ctx.fillText(`${userData.xp}`, 150, 240);

    ctx.font = 'bold 20px Cairo';
    ctx.fillText(`${userData.level}`, 228, 88);

    ctx.font = 'lighter 20px Cairo';
    ctx.fillText(`$${userData.credits}`, 228, 139);
    ctx.fillText(`#${userData.rank || '-'}`, 73, 139);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'profile.png' });
    message.channel.send({ files: [attachment] });
  } catch (e) {
    console.error('[profile] Canvas error:', e.message);
    tools.error(message, 'Failed to generate profile image.', client);
  }
};

exports.help = {
  name: 'profile',
  description: "View a member's profile card.",
  usage: 'profile [@member]'
};