exports.run = (client, message, args, tools) => {
  if (!args.length) return tools.error(message, 'Usage: `rate <something>`', client);

  const score  = Math.floor(Math.random() * 11);
  const stars  = '⭐'.repeat(score) || '(none)';
  const target = args.join(' ');

  const embed = tools.brandedEmbed(client)
    .setTitle(':star: Rating')
    .addFields(
      { name: 'Subject', value: target },
      { name: 'Score',   value: `${stars}  **${score}/10**` }
    )
    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'rate', description: 'Rate something out of 10.', usage: 'rate <something>' };