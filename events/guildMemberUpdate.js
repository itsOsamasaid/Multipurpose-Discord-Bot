const fs   = require('fs');
const path = require('path');
const names = require(path.join(__dirname, '../database/names.json'));

module.exports = (client, oldMember, newMember) => {
  if (oldMember.nickname === newMember.nickname) return;

  if (!names[newMember.guild.id]) names[newMember.guild.id] = {};
  if (!names[newMember.guild.id][newMember.id]) {
    names[newMember.guild.id][newMember.id] = { usernames: '', nicknames: '' };
  }

  if (oldMember.user.username !== newMember.user.username) {
    names[newMember.guild.id][newMember.id].usernames += `, ${newMember.user.username}`;
  }
  if (newMember.nickname) {
    names[newMember.guild.id][newMember.id].nicknames += `, \`${newMember.nickname}\``;
  }

  fs.writeFile(path.join(__dirname, '../database/names.json'), JSON.stringify(names, null, 2), err => {
    if (err) console.error(err);
  });
};