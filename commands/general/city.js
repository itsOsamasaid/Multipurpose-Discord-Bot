const weather = require('weather-js');

exports.run = (client, message, args, tools) => {
  if (!args.length) return tools.error(message, 'Usage: `city <city name>`', client);

  weather.find({ search: args.join(' '), degreeType: 'C' }, (err, result) => {
    if (err || !result || !result.length)
      return tools.error(message, 'Could not find that location. Please try a different city name.', client);

    const current  = result[0].current;
    const location = result[0].location;

    const embed = tools.brandedEmbed(client, 'info')
      .setTitle(`:earth_africa: ${location.name}`)
      .addFields(
        { name: ':thermometer: Temperature', value: `${current.temperature}°C`, inline: true },
        { name: ':wind_blowing_face: Wind',  value: `${current.winddisplay}`,   inline: true },
        { name: ':droplet: Humidity',        value: `${current.humidity}%`,     inline: true },
        { name: ':partly_sunny: Sky',        value: current.skytext,            inline: true },
        { name: ':calendar: Date',           value: current.date,               inline: true },
        { name: ':clock12: Day',             value: current.day,                inline: true }
      );
    message.channel.send({ embeds: [embed] });
  });
};

exports.help = { name: 'city', description: 'Get weather info for a city.', usage: 'city <city name>' };