const fs   = require('fs');
const path = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first();
  if (!target)                          return tools.error(message, 'Please mention a member to give rep to.', client);
  if (target.id === message.author.id)  return tools.error(message, "You can't rep yourself. :x:", client);
  if (!userdata[target.id])             return tools.error(message, "That user doesn't have an account yet.", client);
  if (!userdata[message.author.id])     return tools.error(message, "You don't have an account yet.", client);

  const now      = Date.now();
  const cooldown = 86400000;
  const lastRep  = userdata[message.author.id].lastrep || 0;

  if ((now - lastRep) < cooldown) {
    const remaining = cooldown - (now - lastRep);
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    const timeStr = `${h ? h + 'h ' : ''}${m ? m + 'm ' : ''}${s}s`;

    return message.channel.send({ embeds: [
      tools.brandedEmbed(client, 'warning')
        .setTitle(':stopwatch: Rep Cooldown')
        .addFields({ name: 'Next Rep In', value: timeStr })
    ]});
  }

  userdata[message.author.id].lastrep = now;
  userdata[target.id].reps = (userdata[target.id].reps || 0) + 1;
  fs.writeFile(path.join(__dirname, '../../database/userdata.json'), JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':thumbsup: Rep Given!')
    .addFields(
      { name: 'From',      value: message.author.tag,               inline: true },
      { name: 'To',        value: target.tag,                        inline: true },
      { name: 'Total Reps',value: `\`${userdata[target.id].reps}\``, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'rep',
  description: 'Give reputation to a member (once per day).',
  usage: 'rep @member'
};