const { PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

// Per-process giveaway map (guild id → timeout handle)
const giveaways = new Map();

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission to start a giveaway.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.AddReactions))
    return tools.error(message, 'I need `ADD_REACTIONS` permission.', client);

  // Usage: &giveaway <time> <prize...>
  // e.g.   &giveaway 1h Nitro Classic
  const timeArg  = args[0];
  const prize    = args.slice(1).join(' ');

  if (!timeArg || !prize)
    return tools.error(message, 'Usage: `giveaway <time> <prize>` — e.g. `giveaway 1h Nitro Classic`', client);

  const duration = ms(timeArg);
  if (!duration || duration < 10000 || duration > ms('24h'))
    return tools.error(message, 'Time must be between `10s` and `24h`. Examples: `30m`, `2h`, `1d`', client);

  if (giveaways.has(message.guild.id))
    return tools.error(message, 'There is already a giveaway running in this server.', client);

  const reactions = ['🎉','🎊','🎈','🎁','🔮','🏮'];
  const reaction  = reactions[Math.floor(Math.random() * reactions.length)];

  message.delete().catch(() => {});

  const giveawayEmbed = tools.brandedEmbed(client, 'warning')
    .setTitle('🎉 GIVEAWAY! 🎉')
    .setDescription(`React with ${reaction} for a chance to win **${prize}**!`)
    .addFields({ name: 'Ends In', value: timeArg, inline: true })
    .setFooter({ text: `Hosted by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

  const giveawayMsg = await message.channel.send({ embeds: [giveawayEmbed] });
  await giveawayMsg.react(reaction).catch(() => {});

  const timeout = setTimeout(async () => {
    giveaways.delete(message.guild.id);

    // Fetch fresh message to get up-to-date reactions
    const fresh = await message.channel.messages.fetch(giveawayMsg.id).catch(() => null);
    const reacted = fresh?.reactions.cache.get(reaction);
    const participants = reacted
      ? (await reacted.users.fetch()).filter(u => !u.bot)
      : null;

    if (!participants || !participants.size) {
      giveawayMsg.edit({ embeds: [
        tools.brandedEmbed(client, 'error')
          .setTitle('Giveaway Ended')
          .setDescription(`No one participated in the **${prize}** giveaway. 😕`)
      ]}).catch(() => {});
      return;
    }

    const winner = participants.random();

    giveawayMsg.edit({ embeds: [
      tools.brandedEmbed(client, 'success')
        .setTitle('🎉 Giveaway Ended!')
        .setDescription(`${winner} won **${prize}**! Congratulations!`)
        .setFooter({ text: `Hosted by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    ]}).catch(() => {});

    message.channel.send({ content: `🎉 Congratulations ${winner}! You won **${prize}**!` });

    winner.send({ embeds: [
      tools.brandedEmbed(client, 'success')
        .setTitle('🎉 You Won a Giveaway!')
        .setDescription(`You won **${prize}** in **${message.guild.name}**!\nYou'll be contacted by ${message.author.tag}.`)
    ]}).catch(() => {});

  }, duration);

  giveaways.set(message.guild.id, timeout);
};

exports.help = {
  name: 'giveaway',
  description: 'Start a giveaway. Usage: `giveaway <time> <prize>`',
  usage: 'giveaway <time> <prize>'
};