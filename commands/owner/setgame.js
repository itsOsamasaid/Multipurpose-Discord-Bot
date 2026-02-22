const { ActivityType } = require('discord.js');

exports.run = (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;
  if (!args.length) return tools.error(message, 'Usage: `setgame <text>`', client);

  const text = args.join(' ');
  client.user.setActivity(text, { type: ActivityType.Watching });

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':tv: Status Set')
    .addFields(
      { name: 'Type', value: 'Watching', inline: true },
      { name: 'Text', value: text,        inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'setgame', description: 'Set bot watching status (owner only).', usage: 'setgame <text>' };