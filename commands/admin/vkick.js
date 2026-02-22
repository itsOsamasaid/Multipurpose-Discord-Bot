const { PermissionFlagsBits, ChannelType } = require('discord.js');
const path = require('path');
const log = require(path.join(__dirname, '../../database/log.json'));

exports.run = (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) return tools.error(message, "I Don't Have `MOVE_MEMBERS` Permission", client);
  if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) return tools.error(message, "You don't have permission to perform this action.", client);
  if (!message.mentions.users.first()) return tools.error(message, 'Please mention the member.', client);

  const member = message.guild.members.cache.get(message.mentions.users.first().id);
  if (!member) return tools.error(message, 'Member not found.', client);
  if (!member.voice.channel) return tools.error(message, "That member is not in a voice channel.", client);

  message.guild.channels.create({ name: 'voicekick', type: ChannelType.GuildVoice }).then(c => {
    member.voice.setChannel(c).then(() => {
      setTimeout(() => c.delete().catch(() => {}), 500);
    });
  });

  message.channel.send(`:right_facing_fist: **${message.mentions.users.first().username}** Kicked From Voice Channel`);
}

exports.help = {
  name: 'vkick',
  description: 'Kick a member from a voice channel.',
  usage: 'vkick @member'
};