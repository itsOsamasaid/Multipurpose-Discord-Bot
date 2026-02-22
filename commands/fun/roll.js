exports.run = (client, message, args, tools) => {
  const max = parseInt(args[0]);
  if (!args[0] || isNaN(max) || max < 1)
    return tools.error(message, 'Please provide a valid number. Usage: `roll <max>`', client);

  const result = Math.floor(Math.random() * max) + 1;
  const embed = tools.brandedEmbed(client)
    .setTitle(':game_die: Roll')
    .addFields(
      { name: 'Range',  value: `1 – ${max}`,  inline: true },
      { name: 'Result', value: `**${result}**`, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'roll',
  description: 'Roll a random number.',
  usage: 'roll <max>'
};