const fs   = require('fs');
const path = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  if (!userdata[message.author.id]) return tools.error(message, "You don't have an account yet.", client);

  const data = userdata[message.author.id];
  const now  = Date.now();
  const cooldown = 86400000; // 24 hours

  if (!data.lastdaily || (now - data.lastdaily) >= cooldown) {
    data.lastdaily = now;
    data.credits   = (data.credits || 0) + 500;
    fs.writeFile(path.join(__dirname, '../../database/userdata.json'), JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });

    const embed = tools.brandedEmbed(client, 'success')
      .setTitle(':atm: Daily Claimed!')
      .addFields(
        { name: 'User',       value: message.author.tag, inline: true },
        { name: '+Credits',   value: '`500$`',           inline: true },
        { name: 'New Balance',value: `\`${data.credits}$\``, inline: true }
      );
    message.channel.send({ embeds: [embed] });

  } else {
    const remaining = cooldown - (now - data.lastdaily);
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    const timeStr = `${h ? h + 'h ' : ''}${m ? m + 'm ' : ''}${s}s`;

    const embed = tools.brandedEmbed(client, 'warning')
      .setTitle(':stopwatch: Daily Already Claimed')
      .addFields({ name: 'Refreshes In', value: timeStr });
    message.channel.send({ embeds: [embed] });
  }
};

exports.help = {
  name: 'daily',
  description: 'Claim your daily 500 credits.',
  usage: 'daily'
};