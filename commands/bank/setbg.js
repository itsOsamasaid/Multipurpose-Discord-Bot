const fs   = require('fs');
const path = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = async (client, message, args, tools) => {
  if (!userdata[message.author.id]) return tools.error(message, "You don't have an account yet.", client);

  const num = parseInt(args[0]);
  if (!args[0] || isNaN(num))  return tools.error(message, 'Please provide a background number. Usage: `setbg <number>`', client);
  if (num < 0 || num > 20)     return tools.error(message, 'Background number must be between 0 and 20.', client);

  const data = userdata[message.author.id];
  if (data.credits < 5000) return tools.error(message, "You need at least `5000$` to buy a background.", client);

  const confirm = tools.brandedEmbed(client, 'warning')
    .setTitle(':shopping_cart: Confirm Purchase')
    .setDescription(`Background **#${num}** costs **5000$**.\nType \`confirm\` to proceed.`)
    .addFields({ name: 'Your Balance', value: `\`${data.credits}$\`` });
  message.channel.send({ embeds: [confirm] });

  const filter = m => m.content.toLowerCase() === 'confirm' && m.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000 }).catch(() => null);

  if (!collected || !collected.size) {
    return tools.error(message, 'Purchase cancelled — timed out.', client);
  }

  data.cbg      = path.join(__dirname, `../../storage/profilebg/${num}.png`);
  data.credits -= 5000;
  fs.writeFile(path.join(__dirname, '../../database/userdata.json'), JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });

  tools.success(message, `Background **#${num}** purchased! :mountain_snow: New balance: \`${data.credits}$\``, client);
};

exports.help = {
  name: 'setbg',
  description: 'Buy a profile background for 5000 credits.',
  usage: 'setbg <0-20>'
};