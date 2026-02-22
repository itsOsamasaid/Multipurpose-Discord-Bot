const rgbToHSL = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

exports.run = (client, message, args, tools) => {
  if (!args[0]) return tools.error(message, 'Usage: `colori <#RRGGBB or #RGB>`', client);

  let input = args[0].replace('#', '');
  if (!/^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(input))
    return tools.error(message, 'Color must be in the format `#RRGGBB` or `#RGB`.', client);

  if (input.length === 3) input = input.split('').map(c => c + c).join('');

  const r = parseInt(input.substr(0, 2), 16);
  const g = parseInt(input.substr(2, 2), 16);
  const b = parseInt(input.substr(4, 2), 16);
  const { h, s, l } = rgbToHSL(r, g, b);

  const embed = tools.brandedEmbed(client)
    .setTitle(':art: Color Info')
    .setColor(input)
    .addFields(
      { name: 'Hex', value: `\`#${input.toUpperCase()}\``, inline: true },
      { name: 'RGB', value: `\`${r}, ${g}, ${b}\``,        inline: true },
      { name: 'HSL', value: `\`${h}°, ${s}%, ${l}%\``,    inline: true }
    )
    .setImage(`https://placehold.co/500x100/${input}/${input}.png`);
  message.channel.send({ embeds: [embed] });
};

exports.help = { name: 'colori', description: 'Get info about a hex color.', usage: 'colori <#hex>' };