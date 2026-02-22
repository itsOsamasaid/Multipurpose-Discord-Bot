const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/tempv.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
    return tools.error(message, 'You need `ADMINISTRATOR` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'I need `MANAGE_CHANNELS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers))
    return tools.error(message, 'I need `MOVE_MEMBERS` permission.', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = { tempv: false, temproom: null, tempc: null };

  if (db[message.guild.id].tempv) {
    // Disable — clean up channels
    db[message.guild.id].tempv = false;

    const roomId = db[message.guild.id].temproom;
    const catId  = db[message.guild.id].tempc;
    if (roomId) message.guild.channels.cache.get(roomId)?.delete().catch(() => {});
    if (catId)  message.guild.channels.cache.get(catId)?.delete().catch(() => {});

    save(db);

    const embed = tools.brandedEmbed(client, 'error')
      .setTitle(':microphone2: Temp Voice Disabled')
      .setDescription('Temporary voice system is now **OFF**. Channels deleted.');
    return message.channel.send({ embeds: [embed] });
  }

  // Enable
  if (!args.length) return tools.error(message, 'Usage: `tempv <room name>`', client);

  const roomName = args.join(' ');

  const category = await message.guild.channels.create({
    name: 'Temp Voice Channels',
    type: ChannelType.GuildCategory,
  }).catch(() => null);

  const voiceChannel = await message.guild.channels.create({
    name: roomName,
    type: ChannelType.GuildVoice,
    parent: category?.id ?? null,
  }).catch(() => null);

  if (!category || !voiceChannel) return tools.error(message, 'Failed to create channels.', client);

  db[message.guild.id].tempv    = true;
  db[message.guild.id].tempc    = category.id;
  db[message.guild.id].temproom = voiceChannel.id;
  save(db);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':microphone2: Temp Voice Enabled')
    .addFields(
      { name: 'Category',     value: `\`${category.name}\``,     inline: true },
      { name: 'Trigger Room', value: `\`${voiceChannel.name}\``, inline: true }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'tempv', description: 'Toggle temp voice system.', usage: 'tempv <room name>' };