const giveMeAJoke = require('give-me-a-joke');

exports.run = (client, message, args, tools) => {
  giveMeAJoke.getRandomDadJoke(joke => {
    const embed = tools.brandedEmbed(client)
      .setTitle(':joy: Random Joke')
      .setDescription(`**${joke}**`);
    message.channel.send({ embeds: [embed] });
  });
};

exports.help = {
  name: 'joke',
  description: 'Get a random dad joke.',
  usage: 'joke'
};