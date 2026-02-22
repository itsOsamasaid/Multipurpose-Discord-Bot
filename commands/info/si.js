const { ChannelType } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  const guild = message.guild;
  await guild.fetch();

  const owner  = await guild.fetchOwner();
  const vLevels = ['None', 'Low', 'Medium', 'High', 'Extreme'];

  const textChannels  = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
  const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
  const totalChannels = guild.channels.cache.size;

  const embed = tools.brandedEmbed(client, 'info')
    .setAuthor({ name: guild.name, iconURL: guild.iconURL() ?? undefined })
    .setThumbnail(guild.iconURL({ size: 256 }) ?? null)
    .setTimestamp()
    .addFields(
      { name: ':id: Server ID',          value: `\`${guild.id}\``,                                 inline: true },
      { name: ':calendar: Created',       value: guild.createdAt.toDateString(),                    inline: true },
      { name: ':crown: Owner',            value: `${owner.user.tag}`,                              inline: true },
      { name: ':busts_in_silhouette: Members', value: `\`${guild.memberCount}\``,                  inline: true },
      { name: ':speech_balloon: Channels', value: `Text: \`${textChannels}\` | Voice: \`${voiceChannels}\` | Total: \`${totalChannels}\``, inline: false },
      { name: ':ribbon: Emojis',          value: `\`${guild.emojis.cache.size}\``,                 inline: true },
      { name: ':construction: Verification', value: vLevels[guild.verificationLevel] ?? 'Unknown', inline: true },
      { name: ':closed_lock_with_key: Roles', value: `\`${guild.roles.cache.size}\``,              inline: true },
      { name: ':star: Boost Level',       value: `Tier \`${guild.premiumTier}\` — \`${guild.premiumSubscriptionCount}\` boosts`, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'si', description: 'View server info.', usage: 'si' };