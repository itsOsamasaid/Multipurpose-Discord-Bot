const path = require('path');

exports.run = (client, message, args, tools) => {
  if (message.author.id !== client.config.owner) return;

  const cmd = args.join(' ').toLowerCase();
  if (!cmd) return tools.error(message, 'Provide a command name to reload. Usage: `reload <command>`', client);

  const command = client.commands.get(cmd);
  if (!command) return tools.error(message, `No command found: \`${cmd}\`.`, client);

  // Find the file path by searching command folders
  const fs   = require('fs');
  const base = path.join(__dirname, '../');
  let found  = null;

  for (const folder of fs.readdirSync(base)) {
    const full = path.join(base, folder, `${cmd}.js`);
    if (fs.existsSync(full)) { found = full; break; }
  }

  if (!found) return tools.error(message, `Could not find file for \`${cmd}\`.`, client);

  try {
    delete require.cache[require.resolve(found)];
    const newCmd = require(found);
    client.commands.set(cmd, newCmd);
    tools.success(message, `:repeat: **\`${cmd}\`** reloaded successfully.`, client);
  } catch (e) {
    tools.error(message, `Failed to reload \`${cmd}\`: \`${e.message}\``, client);
  }

  message.delete().catch(() => {});
};

exports.help = { name: 'reload', description: 'Reload a command (owner only).', usage: 'reload <command>' };