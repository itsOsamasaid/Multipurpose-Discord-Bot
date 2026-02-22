const fs   = require('fs');
const path = require('path');

const dbPath = f => path.join(__dirname, '../database', f);
const save   = (file, data) => fs.writeFile(dbPath(file), JSON.stringify(data, null, 2), err => { if (err) console.error(err); });

const guilddata = require(dbPath('guild.json'));
const wlc       = require(dbPath('wlc.json'));
const log       = require(dbPath('log.json'));
const iwlc      = require(dbPath('iwlc.json'));
const autorole  = require(dbPath('autorole.json'));
const tempv     = require(dbPath('tempv.json'));
const adhan     = require(dbPath('adhan.json'));
const vonline   = require(dbPath('vonline.json'));
const adblock   = require(dbPath('adblock.json'));
const names     = require(dbPath('names.json'));
const voice     = require(dbPath('voice.json'));
const text      = require(dbPath('text.json'));
const warns     = require(dbPath('warnings.json'));

module.exports = async (client, guild) => {
  // Bot removed notification — replace with your own log channel
  const logCh = client.channels.cache.get(process.env.BOT_LOG_CHANNEL_ID);
  if (logCh) {
    try {
      const owner = await guild.fetchOwner();
      const embed = client.tools.brandedEmbed(client, 'error')
        .setTitle(`:globe_with_meridians: ${client.config.branding.name} Removed From Server`)
        .setThumbnail(guild.iconURL())
        .addFields(
          { name: 'Guild Name',   value: guild.name },
          { name: 'Owner',        value: owner.user.tag },
          { name: 'Guild ID',     value: guild.id },
          { name: 'Member Count', value: String(guild.memberCount) }
        );
      logCh.send({ embeds: [embed] });
    } catch (_) {}
  }

  // Clean up all guild data
  const id = guild.id;
  [
    [guilddata, 'guild.json'],
    [wlc,       'wlc.json'],
    [log,       'log.json'],
    [iwlc,      'iwlc.json'],
    [autorole,  'autorole.json'],
    [tempv,     'tempv.json'],
    [adhan,     'adhan.json'],
    [vonline,   'vonline.json'],
    [adblock,   'adblock.json'],
    [names,     'names.json'],
    [voice,     'voice.json'],
    [text,      'text.json'],
    [warns,     'warnings.json'],
  ].forEach(([db, file]) => {
    delete db[id];
    save(file, db);
  });
};