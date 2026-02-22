const moment = require('moment');

const hexToRgb = hex => {
  hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r+r+g+g+b+b);
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? `(${parseInt(res[1],16)}, ${parseInt(res[2],16)}, ${parseInt(res[3],16)})` : 'N/A';
};

exports.run = async (client, message, args, tools) => {
  const roleText = args.join(' ').toLowerCase();

  if (!roleText) {
    // List all roles
    const roleList = message.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(r => `\`${r.name}\``)
      .join(' | ')
      .slice(0, 4000) || 'No roles';

    const embed = tools.brandedEmbed(client, 'info')
      .setTitle(':scroll: Server Roles')
      .setDescription(roleList);
    return message.channel.send({ embeds: [embed] });
  }

  const role = message.guild.roles.cache.find(r =>
    r.name.toLowerCase() === roleText || r.id === args[0]
  ) || message.guild.roles.cache.find(r =>
    r.name.toLowerCase().includes(roleText)
  );

  if (!role) return tools.error(message, `No role found for \`${roleText}\`.`, client);

  const embed = tools.brandedEmbed(client, 'info')
    .setColor(role.hexColor === '#000000' ? '#ffffff' : role.hexColor)
    .setTitle(':shield: Role Info')
    .addFields(
      { name: 'Name',       value: role.name,                                                                    inline: true },
      { name: 'ID',         value: `\`${role.id}\``,                                                            inline: true },
      { name: 'Color',      value: `Hex: ${role.hexColor}\nRGB: ${hexToRgb(role.hexColor)}`,                    inline: true },
      { name: 'Members',    value: `\`${role.members.size}\``,                                                  inline: true },
      { name: 'Position',   value: `\`${message.guild.roles.cache.size - role.position}\` of \`${message.guild.roles.cache.size}\``, inline: true },
      { name: 'Hoisted',    value: role.hoist ? 'Yes' : 'No',                                                   inline: true },
      { name: 'Mentionable',value: role.mentionable ? 'Yes' : 'No',                                             inline: true },
      { name: 'Created',    value: moment.utc(role.createdAt).format('YYYY/MM/DD HH:mm') + ' UTC',              inline: false }
    );
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'ri', description: 'View role info or list all roles.', usage: 'ri [role name]' };