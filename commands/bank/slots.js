const fs   = require('fs');
const path = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  if (!userdata[message.author.id]) return tools.error(message, "You don't have an account yet.", client);

  const bet = parseInt(args[0]);
  if (!args[0] || isNaN(bet) || bet <= 0) return tools.error(message, 'Usage: `slots <amount>`', client);

  const data = userdata[message.author.id];
  if (bet > 1000)          return tools.error(message, 'Maximum bet is `1000$`.', client);
  if (bet > data.credits)  return tools.error(message, "You don't have enough credits.", client);

  const items = ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🍎','🍑','🍓','🍒'];
  const roll  = [0,1,2].map(() => Math.floor(Math.random() * items.length));
  const slots = roll.map(i => items[i]);

  let payout = 0;
  let result = '';
  if (roll[0] === roll[1] && roll[1] === roll[2]) {
    payout = bet * 9;
    result = `🎉 **Jackpot! You won \`${payout}$\`!**`;
  } else if (roll[0] === roll[1] || roll[0] === roll[2] || roll[1] === roll[2]) {
    payout = bet * 2;
    result = `✅ **Two of a kind! You won \`${payout}$\`!**`;
  } else {
    payout = -bet;
    result = `❌ **No match. You lost \`${bet}$\`.**`;
  }

  data.credits += payout;
  fs.writeFile(path.join(__dirname, '../../database/userdata.json'), JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });

  const colorKey = payout > 0 ? 'success' : 'error';
  const embed = tools.brandedEmbed(client, colorKey)
    .setTitle(`${slots.join('  ')}`)
    .setDescription(result)
    .addFields(
      { name: 'Bet',     value: `\`${bet}$\``,         inline: true },
      { name: 'Balance', value: `\`${data.credits}$\``, inline: true }
    )
    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'slots',
  description: 'Play the slot machine.',
  usage: 'slots <amount>'
};