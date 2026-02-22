exports.run = (client, message, args, tools) => {
  const embed = tools.brandedEmbed(client)
    .setTitle(`${client.config.branding.name} — Invite`)
    .addFields({
      name: `:zap: Invite ${client.config.branding.name}`,
      value: `[Click Here](https://discord.com/oauth2/authorize?client_id=${client.config.clientid}&permissions=2080374975&scope=bot)`
    });
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'inv',
  description: 'Get the bot invite link.',
  usage: 'inv'
};