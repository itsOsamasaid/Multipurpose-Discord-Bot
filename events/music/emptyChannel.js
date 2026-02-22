module.exports = (client) => {
  client.player.events.on('emptyChannel', (queue) => {
    const channel = queue.metadata?.channel;
    if (!channel) return;

    channel.send('🔇 Voice channel is empty — leaving and stopping music.').catch(() => {});
  });
};