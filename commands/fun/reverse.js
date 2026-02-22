exports.run = (client, message, args, tools) => {
  if (!args.length) return tools.error(message, 'Usage: `reverse <text>`', client);
  const reversed = args.join(' ').split('').reverse().join('');
  const embed = tools.brandedEmbed(client)
    .setTitle(':arrows_counterclockwise: Reversed')
    .addFields(
      { name: 'Original', value: args.join(' ') },
      { name: 'Reversed', value: reversed }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'reverse',
  description: 'Reverse text.',
  usage: 'reverse <text>'
};