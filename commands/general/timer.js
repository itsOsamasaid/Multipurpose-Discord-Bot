const ms = require('ms');

exports.run = (client, message, args, tools) => {
  const timeArg = args[0];
  if (!timeArg) return tools.error(message, 'Usage: `timer <time>` — e.g. `timer 5m`', client);

  const duration = ms(timeArg);
  if (!duration || duration < 1000 || duration > ms('24h'))
    return tools.error(message, 'Time must be between `1s` and `24h`.', client);

  const label = ms(duration, { long: true });

  tools.success(message, `:stopwatch: Timer started for **${label}**!`, client);

  setTimeout(() => {
    const embed = tools.brandedEmbed(client, 'success')
      .setTitle(':alarm_clock: Timer Finished!')
      .setDescription(`${message.author}, your **${label}** timer is up!`);
    message.channel.send({ content: `${message.author}`, embeds: [embed] });
  }, duration);
};

exports.help = { name: 'timer', description: 'Start a countdown timer.', usage: 'timer <time>' };