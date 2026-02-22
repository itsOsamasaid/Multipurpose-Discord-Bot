const { PermissionFlagsBits } = require('discord.js');

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return tools.error(message, "You Don't Have `ADMINISTRATOR` Permission", client);
  if (!args || !args.length) return tools.error(message, 'You should write a message :warning:', client);

  const preview = tools.brandedEmbed(client, 'warning')
    .setTitle('Broadcast Confirmation')
    .setDescription(`Are you sure you want to broadcast this message?\n\`\`\`${args.join(' ')}\`\`\``)

  message.channel.send({ embeds: [preview] }).then(msg => {
    msg.react('✅').then(() => msg.react('❌')).catch(() => {});

    const filter = (reaction, user) => ['✅','❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    const collector = msg.createReactionCollector({ filter, time: 12000, max: 1 });

    collector.on('collect', r => {
      if (r.emoji.name === '✅') {
        const text = args.join(' ').replace('<server>', message.guild.name);
        const bcEmbed = tools.brandedEmbed(client)
          .setTitle('Broadcast')
          .addFields(
            { name: 'Server', value: message.guild.name },
            { name: 'Sender', value: message.author.username },
            { name: 'Message', value: text }
          )
        message.guild.members.cache
          .filter(m => !m.user.bot)
          .forEach(m => m.send({ embeds: [bcEmbed] }).catch(() => {}));

        message.channel.send({ embeds: [tools.brandedEmbed(client, 'success').setTitle(`Broadcast sent to ${message.guild.memberCount} members.`)] });
      } else {
        tools.error(message, 'Broadcast canceled.', client);
      }
      msg.delete().catch(() => {});
    });

    collector.on('end', collected => {
      if (!collected.size) {
        tools.error(message, 'Broadcast timed out.', client);
        msg.delete().catch(() => {});
      }
    });
  });
}

exports.help = {
  name: 'bc',
  description: 'Send a message to all server members.',
  usage: 'bc <message>'
};