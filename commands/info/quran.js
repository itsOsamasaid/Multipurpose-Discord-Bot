exports.run = (client, message, args, tools) => {
  const reciter = 'yasser';
  const links   = [];
  for (let x = 1; x <= 10; x++) {
    links.push(`**${x}.** [Surah ${x}](https://server11.mp3quran.net/${reciter}/${String(x).padStart(3,'0')}.mp3)`);
  }

  const embed = tools.brandedEmbed(client, 'info')
    .setColor('000000')
    .setTitle(':kaaba: Quran Download')
    .setDescription(links.join('\n') + '\n\nبصوت: ياسر الدوسري')
    .setFooter({ text: 'Yasser Al-Dosari recitation', iconURL: client.user.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'quran', description: 'Quran MP3 download links.', usage: 'quran' };