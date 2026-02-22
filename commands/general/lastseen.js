// Note: lastMessage is only populated if the message is still in the client cache.
// For reliable last-seen tracking, a database approach is needed.
// This works for recently active users within the session.

exports.run = async (client, message, args, tools) => {
  const target = message.mentions.users.first();
  if (!target) return tools.error(message, 'Please mention a user. Usage: `lastseen @member`', client);

  const member = await message.guild.members.fetch(target.id).catch(() => null);
  if (!member) return tools.error(message, 'Could not find that member.', client);

  const lastMsg = target.lastMessage;
  if (!lastMsg) {
    return message.channel.send({ embeds: [
      tools.brandedEmbed(client, 'error')
        .setTitle(':eye: Last Seen')
        .setDescription(`**${target.tag}** has not been seen recently (not in cache).`)
    ]});
  }

  const elapsed = Date.now() - lastMsg.createdTimestamp;
  const s = Math.floor(elapsed / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const ago = d ? `${d}d ${h}h ${m}m ${sec}s` : h ? `${h}h ${m}m ${sec}s` : m ? `${m}m ${sec}s` : `${sec}s`;

  const embed = tools.brandedEmbed(client, 'warning')
    .setTitle(':eye: Last Seen')
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: 'User',      value: target.tag, inline: true },
      { name: 'Last Seen', value: `${ago} ago`, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'lastseen', description: "View a member's last seen time.", usage: 'lastseen @member' };