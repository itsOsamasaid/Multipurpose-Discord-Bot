exports.run = (client, message, args, tools) => {
  if (!args.length) return tools.error(message, 'Ask me a question! Usage: `8ball <question>`', client);

  const replies = [
    '✅ Yes.', '❌ No.', "🤷 I don't know.", '⏳ Ask again later.',
    '🚫 Nope.', "😐 I'm not sure.", '🙏 Please no.', '🔮 You tell me.',
    '💯 Absolutely!', '😂 Not a chance.', '🌟 Signs point to yes.',
    '🌑 Outlook not so good.'
  ];

  const embed = tools.brandedEmbed(client, 'random')
    .setTitle(':8ball: Magic 8 Ball')
    .addFields(
      { name: 'Question', value: args.join(' ') },
      { name: 'Answer',   value: replies[Math.floor(Math.random() * replies.length)] }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: '8ball', description: 'Ask the magic 8 ball.', usage: '8ball <question>' };