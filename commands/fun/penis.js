exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first();
  if (!target) return tools.error(message, 'You must mention someone!', client);

  const sizes = ['=','==','===','====','=====','======','=======','========','=========','=========='];
  const size  = sizes[Math.floor(Math.random() * sizes.length)];

  const embed = tools.brandedEmbed(client)
    .setTitle('🍆 Size Meter')
    .addFields(
      { name: 'User',   value: target.tag,           inline: true },
      { name: 'Result', value: `8${size}D`,           inline: true },
      { name: 'Rated By', value: message.author.tag, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'penis',
  description: '🍆 meter.',
  usage: 'penis @user'
};