const fs   = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

const dbPath = path.join(__dirname, '../../database/adhan.json');
const save   = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'You need `MANAGE_CHANNELS` permission.', client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels))
    return tools.error(message, 'I need `MANAGE_CHANNELS` permission.', client);

  const db = require(dbPath);
  if (!db[message.guild.id]) db[message.guild.id] = { toggle: false, adhanr: null };

  const current = db[message.guild.id].toggle;

  if (current) {
    // Turning off
    db[message.guild.id].toggle = false;
    save(db);
    const embed = tools.brandedEmbed(client, 'error')
      .setTitle(':mosque: Adhan Disabled')
      .setDescription('🔕 Adhan notifications are now **OFF**.');
    return message.channel.send({ embeds: [embed] });
  }

  // Turning on — need a voice channel ID
  const channelId = args[0];
  if (!channelId) return tools.error(message, 'Please provide a voice channel ID.\nUsage: `adhanset <voiceChannelId>`', client);

  const vc = message.guild.channels.cache.get(channelId);
  if (!vc) return tools.error(message, `No channel found with ID \`${channelId}\`.`, client);

  db[message.guild.id].toggle = true;
  db[message.guild.id].adhanr = channelId;
  save(db);

  const embed = tools.brandedEmbed(client, 'success')
    .setTitle(':mosque: Adhan Enabled')
    .setDescription('🔔 Adhan notifications are now **ON**.')
    .addFields({ name: 'Voice Channel', value: `${vc}` });
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'adhanset', description: 'Toggle adhan notifications.', usage: 'adhanset <voiceChannelId>' };