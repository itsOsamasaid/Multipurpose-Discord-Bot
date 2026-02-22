const { translate } = require('@vitalets/google-translate-api');
const { PermissionFlagsBits } = require('discord.js');

exports.run = async (client, message, args, tools) => {
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))
    return tools.error(message, ':lock: I need `EMBED_LINKS` permission.', client);

  // Usage: &translate <text> to <language>
  const toIndex = args.lastIndexOf('to');
  if (toIndex < 1 || toIndex === args.length - 1)
    return tools.error(message, 'Usage: `translate <text> to <language>` — e.g. `translate Hello to arabic`', client);

  const text     = args.slice(0, toIndex).join(' ');
  const language = args[toIndex + 1];

  try {
    const result = await translate(text, { to: language });
    const embed  = tools.brandedEmbed(client, 'info')
      .setTitle(':repeat: Translator')
      .addFields(
        { name: `From (${result.raw.src ?? 'auto'})`, value: `\`\`\`${text}\`\`\`` },
        { name: `To (${language})`,                   value: `\`\`\`${result.text}\`\`\`` }
      )
      .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
    message.channel.send({ embeds: [embed] });
  } catch (e) {
    tools.error(message, `Could not translate — unknown language or API error: \`${e.message}\``, client);
  }
};

exports.help = { name: 'translate', description: 'Translate text.', usage: 'translate <text> to <language>' };