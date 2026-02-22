const { AttachmentBuilder } = require('discord.js');
const Canvas  = require('canvas');
const path    = require('path');
const userdata= require(path.join(__dirname, '../../database/userdata.json'));

exports.run = async (client, message, args, tools) => {
  const target   = message.mentions.users.first() || message.author;
  const userData = userdata[target.id];
  if (!userData) return tools.error(message, "This user doesn't have an account yet.", client);

  try {
    const canvas  = Canvas.createCanvas(360, 100);
    const ctx     = canvas.getContext('2d');

    const bg = await Canvas.loadImage(path.join(__dirname, '../../storage/leveling/rank.jpg'));
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.font      = '15px Cairo';
    ctx.fillStyle = '#6d6969';
    ctx.fillText(target.username, 115, 22);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';

    ctx.font = '15px Cairo';
    ctx.fillText(`XP ${userData.xp}`, 268, 70);

    ctx.font = '15px UniSansThinCAPS';
    ctx.fillText(`${userData.level}`, 148, 80);
    ctx.fillText(`$${userData.credits}`, 268, 90);
    ctx.fillText(`#${userData.rank || '-'}`, 273, 50);

    const avatar = await Canvas.loadImage(target.displayAvatarURL({ extension: 'jpg', size: 256 }));
    ctx.beginPath();
    ctx.arc(62, 50, 42, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.drawImage(avatar, 17, 4, 90, 90);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'rank.png' });
    message.channel.send({ files: [attachment] });
  } catch (e) {
    console.error('[rank] Canvas error:', e.message);
    tools.error(message, 'Failed to generate rank card.', client);
  }
};

exports.help = {
  name: 'rank',
  description: "View a member's rank card.",
  usage: 'rank [@member]'
};