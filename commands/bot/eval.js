const { inspect } = require('util');

exports.run = async (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;
  const code = args.join(' ');
  if (!code) return tools.error(message, 'Please provide code to evaluate.', client);

  function clean(text) {
    if (typeof text === 'string')
      return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    return inspect(text);
  }

  try {
    let evaled = eval(code);
    if (typeof evaled !== 'string') evaled = inspect(evaled);

    // Never leak the token
    if (evaled.includes(process.env.TOKEN)) {
      return tools.error(message, ':no_entry: Output contains the bot token — blocked.', client);
    }

    const output = evaled.length > 1900 ? evaled.slice(0, 1900) + '...' : evaled;

    const embed = tools.brandedEmbed(client, 'success')
      .setTitle('Eval — Success')
      .addFields(
        { name: ':inbox_tray: Input',  value: `\`\`\`js
${code.slice(0, 1020)}
\`\`\`` },
        { name: ':outbox_tray: Output',value: `\`\`\`js
${clean(output)}
\`\`\`` }
      );
    message.channel.send({ embeds: [embed] });

  } catch (err) {
    const embed = tools.brandedEmbed(client, 'error')
      .setTitle('Eval — Error')
      .addFields(
        { name: ':inbox_tray: Input', value: `\`\`\`js
${code.slice(0, 1020)}
\`\`\`` },
        { name: ':no_entry: Error',   value: `\`\`\`js
${clean(err)}
\`\`\`` }
      );
    message.channel.send({ embeds: [embed] });
  }
};

exports.help = {
  name: 'eval',
  description: 'Evaluate JavaScript (owner only).',
  usage: 'eval <code>'
};