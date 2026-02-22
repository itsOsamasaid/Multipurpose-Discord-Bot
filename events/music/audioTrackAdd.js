module.exports = (client) => {
  client.player.events.on('audioTrackAdd', (queue, track) => {
    const channel = queue.metadata?.channel;
    if (!channel) return;

    // Don't announce if nothing was playing yet 
    if (!queue.isPlaying()) return;

    channel.send(`🎵 **${track.title}** added to the queue.`).catch(() => {});
  });
};