const ascii = require('ascii-text-generator');

exports.run = (client, message, args, tools) => {
  if (!args.length) return tools.error(message, 'Usage: `text <text>`', client);

  const input = args.join(' ');
  let style1, style2;
  try { style1 = ascii(input, '1'); } catch (_) { style1 = null; }
  try { style2 = ascii(input, '2'); } catch (_) { style2 = null; }

  if (!style1 && !style2)
    return tools.error(message, 'Could not generate ASCII text for that input.', client);

  const embed = tools.brandedEmbed(client)
    .setTitle(':symbols: ASCII Text Generator')
    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

  if (style1) embed.addFields({ name: 'Style 1', value: `\`\`\`fix\n${style1.slice(0, 1020)}\`\`\`` });
  if (style2) embed.addFields({ name: 'Style 2', value: `\`\`\`fix\n${style2.slice(0, 1020)}\`\`\`` });

  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: 'text',
  description: 'Generate ASCII art text.',
  usage: 'text <text>'
};