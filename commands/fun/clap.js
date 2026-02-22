const randomCase = w => w.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');

exports.run = (client, message, args, tools) => {
  if (!args.length) return tools.error(message, 'I need some text to clapify. Usage: `clap <text>`', client);
  message.channel.send(args.map(randomCase).join(' 👏 '));
};

exports.help = {
  name: 'clap',
  description: 'Add clap emojis between words.',
  usage: 'clap <text>'
};