exports.run = (client, message, args, tools) => {
  const brand = client.config.branding;
  const embed = tools.brandedEmbed(client, 'info')
    .setTitle(`About ${brand.name}`)
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
      { name: '🤖 Name',     value: brand.name,             inline: true },
      { name: '📦 Version',  value: brand.version,          inline: true },
      { name: '🏠 Servers',  value: `${client.guilds.cache.size}`, inline: true },
      { name: '🆔 ID',       value: client.user.id,         inline: true },
      { name: '📡 Prefix',   value: client.config.prefix,   inline: true },
      { name: '📚 Library',  value: 'discord.js v14',       inline: true }
    )
    .addFields({
      name: ':zap: Invite',
      value: `[Click Here](https://discord.com/oauth2/authorize?client_id=${client.config.clientid}&permissions=2080374975&scope=bot)`
    });
  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'info',
  description: 'Bot information.',
  usage: 'info'
};