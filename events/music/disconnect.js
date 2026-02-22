module.exports = (client) => {
  client.player.events.on('disconnect', (queue) => {
    const channel = queue.metadata?.channel;
    if (!channel) return;

    channel.send('⚠️ Disconnected from voice channel — music stopped.').catch(() => {});
  });
};