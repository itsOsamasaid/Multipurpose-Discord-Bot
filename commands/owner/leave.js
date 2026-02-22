exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;
  if (!args[0]) return tools.error(message, 'Please provide a Guild ID. Usage: `leave <guildId>`', client);

  const guild = client.guilds.cache.get(args[0]);
  if (!guild) return tools.error(message, `Bot is not in guild \`${args[0]}\`.`, client);

  const msg = await message.channel.send({ embeds: [
    tools.brandedEmbed(client, 'warning')
      .setTitle(':door: Confirm Leave')
      .setDescription(`Leave **${guild.name}**? React ✅ to confirm or ❌ to cancel.`)
  ]});

  await msg.react('✅').catch(() => {});
  await msg.react('❌').catch(() => {});

  const filter    = (r, u) => ['✅','❌'].includes(r.emoji.name) && u.id === message.author.id;
  const collector = msg.createReactionCollector({ filter, max: 1, time: 15000 });

  collector.on('collect', async r => {
    if (r.emoji.name === '✅') {
      await guild.leave().catch(() => {});
      msg.edit({ embeds: [
        tools.brandedEmbed(client, 'success').setDescription(`✅ Left **${guild.name}**.`)
      ]}).catch(() => {});
    } else {
      msg.edit({ embeds: [
        tools.brandedEmbed(client, 'error').setDescription('❌ Cancelled.')
      ]}).catch(() => {});
    }
  });

  collector.on('end', collected => {
    if (!collected.size) msg.edit({ embeds: [
      tools.brandedEmbed(client, 'error').setDescription('⏰ Timed out.')
    ]}).catch(() => {});
  });
};

exports.help = { name: 'leave', description: 'Leave a guild (owner only).', usage: 'leave <guildId>' };