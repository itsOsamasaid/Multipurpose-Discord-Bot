module.exports = (client) => {
  client.player.events.on('playerError', (queue, error) => {
    const channel = queue.metadata?.channel;
    console.error(`[Music] playerError in guild ${queue.guild.id}:`, error.message);
    if (channel) channel.send(`❌ A playback error occurred: \`${error.message}\``).catch(() => {});
  });

  client.player.events.on('error', (queue, error) => {
    const channel = queue.metadata?.channel;
    console.error(`[Music] error in guild ${queue.guild.id}:`, error.message);
    if (channel) channel.send(`❌ Could not process track: \`${error.message}\``).catch(() => {});
  });

  // Verbose debug — dump everything the player does to diagnose silent audio.
  client.player.events.on('debug', (queue, msg) => console.log('[Player debug]', msg));
  client.player.on('debug', (msg) => console.log('[Player core]', msg));
};