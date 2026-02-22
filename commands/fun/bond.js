exports.run = (client, message, args, tools) => {
  if (!args[0]) return tools.error(message, 'Mention at least one user. Usage: `bond @user1 [@user2]`', client);

  const mentions = [...message.mentions.users.values()];
  const user1 = message.author;
  const user2 = mentions[0] || { tag: args[0] };
  const user3 = mentions[1] || null;

  const score = Math.floor(Math.random() * 102);

  let ship, bar;
  if      (score > 100)               { ship = 'Perfect Couple 💞';          bar = '♥♥♥♥♥♥♥♥♥♥'; }
  else if (score === 100)             { ship = 'Lit Couple 🔥';              bar = '♥♥♥♥♥♥♥♥♥♥'; }
  else if (score >= 90)               { ship = 'Great Couple ❤️';            bar = '♥♥♥♥♥♥♥♥♥🖤'; }
  else if (score >= 80)               { ship = 'Great Couple ❤️';            bar = '♥♥♥♥♥♥♥♥🖤🖤'; }
  else if (score >= 70)               { ship = 'Could work out!';            bar = '♥♥♥♥♥♥♥🖤🖤🖤'; }
  else if (score >= 60)               { ship = 'Eh.';                        bar = '♥♥♥♥♥♥🖤🖤🖤🖤'; }
  else if (score >= 50)               { ship = 'Eh.';                        bar = '♥♥♥♥♥🖤🖤🖤🖤🖤'; }
  else if (score >= 40)               { ship = 'Eh.';                        bar = '♥♥♥♥🖤🖤🖤🖤🖤🖤'; }
  else if (score >= 30)               { ship = 'Eh.';                        bar = '♥♥♥🖤🖤🖤🖤🖤🖤🖤'; }
  else if (score >= 20)               { ship = 'No Comment 💀';              bar = '♥♥🖤🖤🖤🖤🖤🖤🖤🖤'; }
  else if (score >= 10)               { ship = 'Rip 😬';                     bar = '♥🖤🖤🖤🖤🖤🖤🖤🖤🖤'; }
  else                                { ship = 'Not even possible...';       bar = '🖤🖤🖤🖤🖤🖤🖤🖤🖤🖤'; }

  const users = user3
    ? `${user1} x ${user2} x ${user3}`
    : `${user1} x ${user2}`;

  const embed = tools.brandedEmbed(client)
    .setColor('f5a3fa')
    .setTitle(':heartpulse: Bond Meter')
    .addFields(
      { name: 'Users',      value: users },
      { name: 'Bond Score', value: `**${score}%**`,  inline: true },
      { name: 'Bond Bar',   value: bar,               inline: true },
      { name: 'Summary',    value: ship }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'bond',
  description: 'Love meter between users.',
  usage: 'bond @user1 [@user2]'
};