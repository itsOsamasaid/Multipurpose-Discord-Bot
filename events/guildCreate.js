const fs   = require('fs');
const path = require('path');

// Helper: write a db file relative to project root
const dbPath = f => path.join(__dirname, '../database', f);
const save   = (file, data) => fs.writeFile(dbPath(file), JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

// Load all db files
const config   = require(path.join(__dirname, '../database/config.json'));
const guilddata= require(dbPath('guild.json'));
const wlc      = require(dbPath('wlc.json'));
const log      = require(dbPath('log.json'));
const iwlc     = require(dbPath('iwlc.json'));
const autorole = require(dbPath('autorole.json'));
const tempv    = require(dbPath('tempv.json'));
const adhan    = require(dbPath('adhan.json'));
const vonline  = require(dbPath('vonline.json'));
const adblock  = require(dbPath('adblock.json'));

module.exports = async (client, guild) => {
  console.log(`[guildCreate] ${guild.name} (${guild.id}) — ${guild.memberCount} members`);

  // Guild config
  if (!guilddata[guild.id]) guilddata[guild.id] = { guildid: guild.id, prefix: config.prefix };
  save('guild.json', guilddata);

  // Welcome system
  if (!wlc[guild.id]) wlc[guild.id] = { wlctoggle: false, wlcchannel: '', wlcdm: false, wlcmsg: '', wlcleave: '' };
  save('wlc.json', wlc);

  // Log system
  if (!log[guild.id]) log[guild.id] = { logchannel: '', logtoggle: false };
  save('log.json', log);

  // Image welcome system
  if (!iwlc[guild.id]) iwlc[guild.id] = { iwlcchannel: '', iwlctoggle: false };
  save('iwlc.json', iwlc);

  // Auto-role system
  if (!autorole[guild.id]) autorole[guild.id] = { autorole: '', autoroletoggle: false };
  save('autorole.json', autorole);

  // Temp voice system
  if (!tempv[guild.id]) tempv[guild.id] = { tempc: '', temproom: '', tempv: false };
  save('tempv.json', tempv);

  // Adhan system
  if (!adhan[guild.id]) adhan[guild.id] = { adhanr: '', toggle: false };
  save('adhan.json', adhan);

  // Voice online system
  if (!vonline[guild.id]) vonline[guild.id] = { vroom: '', rname: '', vx: 0, vonline: false };
  save('vonline.json', vonline);

  // Ad-block system
  if (!adblock[guild.id]) adblock[guild.id] = { adblock: false };
  save('adblock.json', adblock);

  // Bot added notification — replace channel ID with your own log channel
  const logCh = client.channels.cache.get(process.env.BOT_LOG_CHANNEL_ID);
  if (logCh) {
    try {
      const owner = await guild.fetchOwner();
      const embed = client.tools.brandedEmbed(client, 'success')
        .setTitle(`:globe_with_meridians: ${client.config.branding.name} Added To Server!`)
        .setThumbnail(guild.iconURL())
        .addFields(
          { name: 'Guild Name',    value: guild.name },
          { name: 'Owner',         value: owner.user.tag },
          { name: 'Guild ID',      value: guild.id },
          { name: 'Member Count',  value: String(guild.memberCount) }
        );
      logCh.send({ embeds: [embed] });
    } catch (_) {}
  }

  // Leave servers under 25 members
  if (guild.memberCount < 1) {
    guild.leave().catch(() => {});
    guild.fetchOwner().then(owner => {
      owner.send({ embeds: [
        client.tools.brandedEmbed(client, 'error')
          .setDescription(`**I can't join servers with fewer than 25 members. :x:**`)
      ]}).catch(() => {});
    }).catch(() => {});
  }
};