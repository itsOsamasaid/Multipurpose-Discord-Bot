const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/vonline.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'You need `MANAGE_CHANNELS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'I need `MANAGE_CHANNELS` permission.', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = { vonline: false, vroom: null, rname: null };

  if (db[message.guild.id].vonline) {
    // Disable — delete counter channel
    db[message.guild.id].vonline = false;
    const ch = message.guild.channels.cache.get(db[message.guild.id].vroom);
    if (ch) await ch.delete().catch(() => {});
    save(db);

    const embed = tools.brandedEmbed(client, 'error')
      .setTitle(':headphones: Voice Online Counter Disabled');
    return message.channel.send({ embeds: [embed] });
  }

  // Enable
  const rname = args.length ? args.join(' ') : 'Voice Online: {count}';

  const channel = await message.guild.channels.create({
    name: rname.replace('{count}', '0'),
    type: ChannelType.GuildVoice,
  }).catch(() => null);

  if (!channel) return tools.error(message, 'Failed to create voice channel.', client);

  // Lock channel so no one can join (display only)
  await channel.permissionOverwrites.edit(message.guild.id, { Connect: false }).catch(() => {});

  db[message.guild.id].vonline = true;
  db[message.guild.id].vroom   = channel.id;
  db[message.guild.id].rname   = rname;
  save(db);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':headphones: Voice Online Counter Enabled')
    .addFields({ name: 'Channel', value: `${channel}` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'vonline', description: 'Toggle voice online counter channel.', usage: 'vonline [name]' };