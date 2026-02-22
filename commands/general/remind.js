const ms = require('ms');

exports.run = (client, message, args, tools) => {
  const timeArg = args[0];
  const text    = args.slice(1).join(' ');

  if (!timeArg || !text)
    return tools.error(message, 'Usage: `remind <time> <reminder text>` — e.g. `remind 30m Buy milk`', client);

  const duration = ms(timeArg);
  if (!duration || duration < 1000 || duration > ms('7d'))
    return tools.error(message, 'Time must be between `1s` and `7d`. Examples: `30m`, `2h`, `1d`', client);

  const confirmEmbed = tools.brandedEmbed(client, 'success')
    .setTitle(':alarm_clock: Reminder Set')
    .addFields(
      { name: 'Reminder', value: text,                        inline: false },
      { name: 'Time',     value: ms(duration, { long: true }), inline: true }
    );
  message.channel.send({ embeds: [confirmEmbed] });

  setTimeout(() => {
    const fireEmbed = tools.brandedEmbed(client, 'warning')
      .setTitle(':bell: Reminder!')
      .setDescription(`${message.author}, here's your reminder:`)
      .addFields({ name: 'Reminder', value: text })
      .setFooter({ text: `Set ${ms(duration, { long: true })} ago`, iconURL: message.author.displayAvatarURL() });
    message.channel.send({ content: `${message.author}`, embeds: [fireEmbed] });
  }, duration);
};

exports.help = { name: 'remind', description: 'Set a reminder.', usage: 'remind <time> <text>' };