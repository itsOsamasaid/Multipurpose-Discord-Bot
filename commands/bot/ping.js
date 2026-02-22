exports.run = async (client, message, args, tools) => {
  const msg = await message.channel.send({ embeds: [
    tools.brandedEmbed(client).setTitle(':ping_pong: Pinging...')
  ]});
  const latency = msg.createdTimestamp - message.createdTimestamp;
  msg.edit({ embeds: [
    tools.brandedEmbed(client, 'success')
      .setTitle(':ping_pong: Pong!')
      .addFields(
        { name: 'Message Latency', value: `\`${latency}ms\``,              inline: true },
        { name: 'API Latency',     value: `\`${Math.round(client.ws.ping)}ms\``, inline: true }
      )
  ]});
};

exports.help = {
  name: 'ping',
  description: 'Check bot latency.',
  usage: 'ping'
};