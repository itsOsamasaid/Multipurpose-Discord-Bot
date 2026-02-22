const fs   = require('fs');
const path = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first();
  const amount = parseInt(args[1]);

  if (!target)         return tools.error(message, 'You must mention a user. Usage: `credit @user <amount>`', client);
  if (isNaN(amount) || amount <= 0) return tools.error(message, 'Please provide a valid amount.', client);
  if (target.id === message.author.id) return tools.error(message, "You can't transfer credits to yourself.", client);
  if (!userdata[target.id])           return tools.error(message, "That user doesn't have an account yet.", client);
  if (!userdata[message.author.id])   return tools.error(message, "You don't have an account yet.", client);
  if (userdata[message.author.id].credits < amount) return tools.error(message, "You don't have enough credits. :x:", client);

  userdata[message.author.id].credits -= amount;
  userdata[target.id].credits         += amount;

  fs.writeFile(path.join(__dirname, '../../database/userdata.json'), JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':moneybag: Transfer Complete')
    .addFields(
      { name: 'From',   value: message.author.tag, inline: true },
      { name: 'To',     value: target.tag,          inline: true },
      { name: 'Amount', value: `\`${amount}$\``,    inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'credit',
  description: 'Transfer credits to another user.',
  usage: 'credit @user <amount>'
};