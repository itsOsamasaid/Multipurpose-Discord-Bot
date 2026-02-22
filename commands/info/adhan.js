const adhan = require('adhan');

// City coordinates lookup — add more as needed
const cities = {
  mecca:   { lat: 21.3891, lng: 39.8579 },
  medina:  { lat: 24.5247, lng: 39.5692 },
  riyadh:  { lat: 24.7136, lng: 46.6753 },
  dubai:   { lat: 25.2048, lng: 55.2708 },
  cairo:   { lat: 30.0444, lng: 31.2357 },
  london:  { lat: 51.5074, lng: -0.1278 },
  newyork: { lat: 40.7128, lng: -74.0060 },
  istanbul:{ lat: 41.0082, lng: 28.9784 },
  jakarta: { lat: -6.2088, lng: 106.8456 },
  karachi: { lat: 24.8607, lng: 67.0011 },
};

exports.run = (client, message, args, tools) => {
  const cityKey = args[0]?.toLowerCase().replace(/\s+/g, '');
  const coords  = cities[cityKey];

  if (!cityKey || !coords) {
    const list = Object.keys(cities).join(', ');
    return tools.error(message, `Please provide a city. Available cities: \`${list}\`\nUsage: \`adhan <city>\``, client);
  }

  const date        = new Date();
  const coordinates = new adhan.Coordinates(coords.lat, coords.lng);
  const params      = adhan.CalculationMethod.UmmAlQura();
  params.madhab     = adhan.Madhab.Shafi;
  const pt          = new adhan.PrayerTimes(coordinates, date, params);

  const fmt = t => t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const embed = tools.brandedEmbed(client, 'info')
    .setColor('FEAE2E')
    .setTitle(':mosque: Prayer Times')
    .setDescription(`**${cityKey.charAt(0).toUpperCase() + cityKey.slice(1)}** — ${date.toDateString()}`)
    .addFields(
      { name: '🌅 Fajr',    value: fmt(pt.fajr),    inline: true },
      { name: '☀️ Sunrise', value: fmt(pt.sunrise),  inline: true },
      { name: '🌤️ Dhuhr',   value: fmt(pt.dhuhr),   inline: true },
      { name: '🌇 Asr',     value: fmt(pt.asr),     inline: true },
      { name: '🌆 Maghrib', value: fmt(pt.maghrib),  inline: true },
      { name: '🌙 Isha',    value: fmt(pt.isha),    inline: true }
    )
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'adhan', description: 'Prayer times for a city.', usage: 'adhan <city>' };