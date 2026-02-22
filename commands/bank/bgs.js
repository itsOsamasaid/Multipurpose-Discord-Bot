exports.run = (client, message, args, tools) => {
  const pages = [
    'https://cdn.discordapp.com/attachments/421017977232556032/445104966223527941/0.png',
    'https://cdn.discordapp.com/attachments/421017977232556032/445104970518364160/1.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445104981155250178/3.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445104987278671873/4.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445104995025813504/5.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445104975991930880/2.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105000176418816/7.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105006723465216/8.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105016114642954/9.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105023081381903/10.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105027330211870/11.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105033634250763/12.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105040164651019/13.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105045533491200/14.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105051145338892/15.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105058338570240/16.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105062759497736/17.jpg',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105069336035338/18.png',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105070539931660/19.png',
    'https://cdn.discordapp.com/attachments/421017977232556032/445105072016195584/20.png',
  ];

  const p = client.config.prefix;
  let page = 0;

  const buildEmbed = () => tools.brandedEmbed(client)
    .setTitle(':frame_photo: Profile Backgrounds')
    .setDescription(`Use \`${p}setbg ${page}\` to buy this background for **5000$**`)
    .setImage(pages[page])
    .setFooter({ text: `Background ${page} of ${pages.length - 1} • ${client.config.branding.footer}`, iconURL: client.user.displayAvatarURL() });

  message.channel.send({ embeds: [buildEmbed()] }).then(msg => {
    msg.react('◀').then(() => msg.react('▶')).catch(() => {});

    const filter = (reaction, user) => ['◀','▶'].includes(reaction.emoji.name) && user.id === message.author.id;
    const collector = msg.createReactionCollector({ filter, time: 180000 });

    collector.on('collect', (reaction, user) => {
      reaction.users.remove(user.id).catch(() => {});
      if (reaction.emoji.name === '◀') page = Math.max(0, page - 1);
      if (reaction.emoji.name === '▶') page = Math.min(pages.length - 1, page + 1);
      msg.edit({ embeds: [buildEmbed()] }).catch(() => {});
    });

    collector.on('end', () => msg.reactions.removeAll().catch(() => {}));
  });
};

exports.help = {
  name: 'bgs',
  description: 'Browse available profile backgrounds.',
  usage: 'bgs'
};