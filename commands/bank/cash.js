const fs   = require('fs');
const path = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;

  const target = message.mentions.users.first();
  const amount = parseInt(args[0]);

  if (isNaN(amount) || amount <= 0) return tools.error(message, 'Usage: `cash <amount> @user`', client);
  if (!target)                      return tools.error(message, 'You must mention a user.', client);
  if (!userdata[target.id])         return tools.error(message, "That user doesn't have an account yet.", client);

  userdata[target.id].credits += amount;
  fs.writeFile(path.join(__dirname, '../../database/userdata.json'), JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':moneybag: Credits Deposited')
    .addFields(
      { name: 'Recipient', value: target.tag,       inline: true },
      { name: 'Amount',    value: `\`${amount}$\``, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'cash',
  description: 'Deposit credits to a user (owner only).',
  usage: 'cash <amount> @user'
};