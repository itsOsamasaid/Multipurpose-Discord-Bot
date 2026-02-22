const { ActivityType } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;
  if (!args.length) return tools.error(message, 'Usage: `setact <text>` — then pick the activity type.', client);

  const text = args.join(' ');

  const msg = await message.channel.send({ embeds: [
    tools.brandedEmbed(client, 'info')
      .setTitle(':performing_arts: Set Activity')
      .setDescription(`React to choose activity type for: **${text}**\n\n🎮 Playing\n📺 Watching\n🎵 Listening`)
  ]});

  for (const e of ['🎮','📺','🎵']) await msg.react(e).catch(() => {});

  const types = { '🎮': ActivityType.Playing, '📺': ActivityType.Watching, '🎵': ActivityType.Listening };
  const labels = { '🎮': 'Playing', '📺': 'Watching', '🎵': 'Listening' };

  const filter    = (r, u) => Object.keys(types).includes(r.emoji.name) && u.id === message.author.id;
  const collector = msg.createReactionCollector({ filter, max: 1, time: 15000 });

  collector.on('collect', r => {
    const type  = types[r.emoji.name];
    const label = labels[r.emoji.name];
    client.user.setActivity(text, { type });
    msg.edit({ embeds: [
      tools.brandedEmbed(client, 'success')
        .setTitle(':performing_arts: Activity Set')
        .addFields(
          { name: 'Type', value: label, inline: true },
          { name: 'Text', value: text,  inline: true }
        )
    ]}).catch(() => {});
  });

  collector.on('end', collected => {
    if (!collected.size) msg.edit({ embeds: [
      tools.brandedEmbed(client, 'error').setDescription('⏰ Timed out.')
    ]}).catch(() => {});
  });
};

exports.help = { name: 'setact', description: 'Set bot activity (owner only).', usage: 'setact <text>' };