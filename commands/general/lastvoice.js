// Shows how long ago the member joined the server (joinedAt).
// True last-voice tracking requires storing voice join/leave events in a database.

exports.run = async (client, message, args, tools) => {
  const target = message.mentions.users.first();
  if (!target) return tools.error(message, 'Please mention a user. Usage: `lastvoice @member`', client);

  const member = await message.guild.members.fetch(target.id).catch(() => null);
  if (!member) return tools.error(message, 'Could not find that member.', client);

  if (member.voice.channel) {
    return message.channel.send({ embeds: [
      tools.brandedEmbed(client, 'success')
        .setTitle(':microphone2: Voice Status')
        .setDescription(`**${target.tag}** is currently in **${member.voice.channel.name}**.`)
    ]});
  }

  if (!member.joinedAt) {
    return tools.error(message, `No voice data found for **${target.tag}**.`, client);
  }

  const elapsed = Date.now() - member.joinedTimestamp;
  const s = Math.floor(elapsed / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const ago = d ? `${d}d ${h}h ${m}m ${sec}s` : h ? `${h}h ${m}m ${sec}s` : m ? `${m}m ${sec}s` : `${sec}s`;

  const embed = tools.brandedEmbed(client, 'warning')
    .setTitle(':microphone2: Last Voice')
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: 'User',         value: target.tag,          inline: true },
      { name: 'Joined Server', value: `${ago} ago`,        inline: true }
    )
    .setFooter({ text: 'Note: exact last-voice time requires database tracking', iconURL: client.user.displayAvatarURL() });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'lastvoice', description: "View a member's voice status.", usage: 'lastvoice @member' };