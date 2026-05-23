const chalk = require('chalk');
const { ActivityType } = require('discord.js');

module.exports = client => {
  const brand = client.config.branding;

  console.log(chalk.green('[Bot]    ') + `${brand.name} v${brand.version}`);
  console.log(chalk.green('[Bot ID] ') + client.user.id);
  console.log(chalk.green('[Servers]') + ' ' + client.guilds.cache.size);
  console.log(chalk.cyan(`\n[${brand.name}]: Ready!`));

  client.user.setActivity(`${client.config.prefix}help | ${brand.name}`, { type: ActivityType.Playing });
};