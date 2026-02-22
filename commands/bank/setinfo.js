const fs   = require('fs');
const path = require('path');
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

exports.run = (client, message, args, tools) => {
  if (!userdata[message.author.id]) return tools.error(message, "You don't have an account yet.", client);
  if (!args.length) return tools.error(message, 'Please provide a status. Usage: `setinfo <text>`', client);

  const status = args.join(' ');
  if (status.length > 45) return tools.error(message, 'Status must be 45 characters or less.', client);

  userdata[message.author.id].statu = status;
  fs.writeFile(path.join(__dirname, '../../database/userdata.json'), JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });

  tools.success(message, `Status set to **${status}** :white_check_mark:`, client);
};

exports.help = {
  name: 'setinfo',
  description: 'Set your profile status (max 45 chars).',
  usage: 'setinfo <text>'
};