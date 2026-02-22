const moment = require('moment');

exports.run = (client, message, args, tools) => {
  const target = message.mentions.users.first() || message.author;
  moment.locale('en');

  const embed = tools.brandedEmbed(client, 'info')
    .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
    .setTitle(':calendar: Date & Time')
    .addFields(
      { name: ':clock1: Time', value: moment().format('HH:mm:ss'),    inline: true },
      { name: ':date: Date',   value: moment().format('YYYY/MM/DD'),   inline: true },
      { name: ':earth_africa: Day', value: moment().format('dddd'),   inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'td', description: 'View current time and date.', usage: 'td [@member]' };