module.exports = (client, event, shardId) => {
  console.log(`[Shard ${shardId ?? 0}] Disconnected: code ${event?.code}`);
};