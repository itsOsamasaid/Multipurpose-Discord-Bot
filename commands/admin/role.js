const { PermissionFlagsBits } = require('discord.js');

exports.run = (client, message, args, tools) => {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return tools.error(message, "You Don't Have `MANAGE_ROLES` Permission", client);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return tools.error(message, "I Don't Have `MANAGE_ROLES` Permission", client);

  const usageEmbed = tools.brandedEmbed(client)
    .addFields({ name: 'Role Command :warning:', value: '`role @member <role_name>`\n`role all <role_name>`\n`role bots <role_name>`\n`role humans <role_name>`' })

  if (!args[0]) {
    return message.channel.send({ embeds: [usageEmbed] })
      .then(msg => setTimeout(() => msg.delete().catch(() => {}), 7000));
  }

  let member = message.mentions.members.first();
  let roleName = args.slice(member ? 1 : 0).join(' ');

  if (member) {
    const removing = roleName.startsWith('-');
    if (removing) roleName = roleName.slice(1).trim();
    const role1 = message.guild.roles.cache.find(r => r.name === roleName);
    if (!role1) return tools.error(message, `No role found with name **${roleName}** :x:`, client);
    if (removing) {
      member.roles.remove(role1).then(() => tools.success(message, `**${roleName}** removed from ${member} successfully!`, client));
    } else {
      member.roles.add(role1).then(() => tools.success(message, `**${roleName}** added to ${member} successfully!`, client));
    }
  } else if (args[0] === 'all' || args[0] === 'humans' || args[0] === 'bots') {
    const filter = args[0];
    roleName = args.slice(1).join(' ');
    const role1 = message.guild.roles.cache.find(r => r.name === roleName);
    if (!role1) return tools.error(message, `No role found with name **${roleName}** :x:`, client);

    message.channel.send({ embeds: [tools.brandedEmbed(client).setTitle('Please wait... :hourglass_flowing_sand:')] }).then(msg => {
      let members = message.guild.members.cache;
      if (filter === 'humans') members = members.filter(m => !m.user.bot);
      if (filter === 'bots')   members = members.filter(m => m.user.bot);
      members.forEach(m => m.roles.add(role1).catch(() => {}));
      msg.edit({ embeds: [tools.brandedEmbed(client, 'success').setTitle(`**${roleName}** added to ${members.size} ${filter} successfully!`)] });
    });
  }
}

exports.help = {
  name: 'role',
  description: 'Give or remove a role from a member, all, humans, or bots.',
  usage: 'role <@member|all|humans|bots> <role_name>'
};