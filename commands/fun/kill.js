exports.run = (client, message, args, tools) => {
  const target = message.mentions.members.first();
  if (!target) return tools.error(message, 'Mention someone to kill. Usage: `kill @user`', client);

  const scenarios = [
    `⬇ **${target}** falls into your quarter-mile pit.`,
    `🚚 You drive over **${target}** with a Ford truck.`,
    `🍔 You feed **${target}** too much trans fat until their arteries clog.`,
    `⚡ You challenge **${target}** to a rap battle and they die of embarrassment.`,
    `🎵 **${target}** listened to your playlist on repeat and couldn't take it anymore.`,
    `🌊 You pushed **${target}** off a rubber ducky and they drowned in the bathtub.`,
  ];

  const embed = tools.brandedEmbed(client)
    .setColor('000000')
    .setTitle(':skull: Kill')
    .setDescription(scenarios[Math.floor(Math.random() * scenarios.length)]);
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'kill',
  description: 'Kill a member (fun).',
  usage: 'kill @user'
};