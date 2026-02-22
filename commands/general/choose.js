exports.run = (client, message, args, tools) => {
  if (args.length < 2) return tools.error(message, 'Give me at least two options separated by spaces. Usage: `choose <option1> <option2> ...`', client);

  const pick = args[Math.floor(Math.random() * args.length)];
  const embed = tools.brandedEmbed(client)
    .setTitle(':thinking: I Choose...')
    .addFields(
      { name: 'Options', value: args.join(' | ') },
      { name: 'My Pick', value: `**${pick}**` }
    )
    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'choose', description: 'Choose between options.', usage: 'choose <opt1> <opt2> ...' };