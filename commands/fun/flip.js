exports.run = (client, message, args, tools) => {
  const result = Math.random() < 0.5 ? '**HEADS** 🪙' : '**TAILS** 🪙';
  const embed = tools.brandedEmbed(client)
    .setTitle(':coin: Coin Flip')
    .setDescription(result)
    .setThumbnail('https://cdn.onlinewebfonts.com/svg/img_441809.png');
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'flip',
  description: 'Flip a coin.',
  usage: 'flip'
};