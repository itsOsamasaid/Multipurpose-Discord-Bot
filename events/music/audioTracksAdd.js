module.exports = (client) => {
  client.player.events.on('audioTracksAdd', (queue, tracks) => {
    const channel = queue.metadata?.channel;
    if (!channel) return;

    channel.send(`🎵 Added **${tracks.length}** tracks to the queue.`).catch(() => {});
  });
};