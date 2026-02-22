module.exports = (client) => {
  client.player.events.on('emptyQueue', (queue) => {
    const channel = queue.metadata?.channel;
    if (!channel) return;

    channel.send('✅ Queue finished — no more tracks. Use `play` to add more!').catch(() => {});
  });
};