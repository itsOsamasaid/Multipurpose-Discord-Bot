const choices = ['rock', 'paper', 'scissors'];
const emoji   = { rock: '🪨', paper: '📄', scissors: '✂️' };

// wins[player] = what player beats
const wins = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

exports.run = (client, message, args, tools) => {
  const player = args[0]?.toLowerCase();
  if (!player || !choices.includes(player))
    return tools.error(message, 'Choose rock, paper, or scissors. Usage: `rps <rock|paper|scissors>`', client);

  const bot = choices[Math.floor(Math.random() * choices.length)];

  let result, colorKey;
  if (player === bot) {
    result   = "It's a tie! 🤝";
    colorKey = 'warning';
  } else if (wins[player] === bot) {
    result   = 'You win! 🎉';
    colorKey = 'success';
  } else {
    result   = 'I win! 😏';
    colorKey = 'error';
  }

  const embed = tools.brandedEmbed(client, colorKey)
    .setTitle(`${emoji[player]} Rock, Paper, Scissors`)
    .addFields(
      { name: 'You',    value: `${emoji[player]} ${player}`, inline: true },
      { name: 'Bot',    value: `${emoji[bot]} ${bot}`,       inline: true },
      { name: 'Result', value: result }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'rps',
  description: 'Play Rock Paper Scissors.',
  usage: 'rps <rock|paper|scissors>'
};