const { PermissionFlagsBits } = require('discord.js');
const path = require('path');
const config = require(path.join(__dirname, '../../database/config.json'));
const warns = require(path.join(__dirname, '../../database/warnings.json'));

exports.run = async (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return tools.error(message, "You Don't Have `ADMINISTRATOR` Permission", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) return tools.error(message, "I Don't Have `ADMINISTRATOR` Permission", client);

  try {
    if (!warns[message.guild.id] || Object.keys(warns[message.guild.id]).length === 0) {
      return tools.success(message, 'No one has been warned yet.', client);
    }

    let warnedUsers = [];
    for (let userID of Object.keys(warns[message.guild.id])) {
      const member = await message.guild.members.fetch(userID).catch(() => null);
      if (member) {
        warnedUsers.push(`**${member.user.tag}** - \`${warns[message.guild.id][userID].warns} Warnings\``);
      }
    }

    const embed = tools.brandedEmbed(client, 'warning')
      .setTitle('Warning List')
      .setDescription(warnedUsers.length ? warnedUsers.join('\n') : 'No one has been warned yet.')

    message.channel.send({ embeds: [embed] });
  } catch (e) {
    console.log(e);
  }
};

exports.help = {
  name: 'warnlist',
  description: 'List all warned members.',
  usage: 'warnlist'
};