const fs   = require('fs');
const path = require('path');

const games    = require(path.join(__dirname, '../../database/games.json'));
const userdata = require(path.join(__dirname, '../../database/userdata.json'));

const save = () => {
  fs.writeFile(path.join(__dirname, '../../database/games.json'),    JSON.stringify(games,    null, 2), err => { if (err) console.error(err); });
  fs.writeFile(path.join(__dirname, '../../database/userdata.json'), JSON.stringify(userdata, null, 2), err => { if (err) console.error(err); });
};

/**
 * runQuiz — shared quiz engine for all Arabic game commands.
 *
 * @param {Client}  client
 * @param {Message} message
 * @param {object}  tools
 * @param {object}  opts
 * @param {string}  opts.questionsFile  — absolute path to the JSON question bank
 * @param {string}  opts.title          — embed title (question prompt)
 * @param {string}  opts.footer         — timer hint text
 * @param {number}  opts.time           — ms to wait for answer
 * @param {number}  [opts.reward=25]    — credits awarded for correct answer
 */
module.exports = async function runQuiz(client, message, tools, opts) {
  const bank = require(opts.questionsFile);
  const keys = Object.keys(bank);
  const key  = keys[Math.floor(Math.random() * keys.length)];
  const q    = bank[key];

  // Ensure game data exists for this guild/user
  if (!games[message.guild.id])                      games[message.guild.id] = {};
  if (!games[message.guild.id][message.author.id])   games[message.guild.id][message.author.id] = { wins: 0, loses: 0 };
  if (!userdata[message.guild.id])                   userdata[message.guild.id] = {};
  if (!userdata[message.guild.id][message.author.id]) userdata[message.guild.id][message.author.id] = { credits: 500 };

  const reward = opts.reward ?? 25;

  const questionEmbed = tools.brandedEmbed(client, 'info')
    .setTitle(opts.title)
    .setDescription(`**${q.ques}**`)
    .setFooter({ text: opts.footer, iconURL: client.user.displayAvatarURL() });

  message.channel.send({ embeds: [questionEmbed] });

  const filter = m => m.content.trim().startsWith(q.ans);

  try {
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: opts.time, errors: ['time'] });
    const winner    = collected.first();

    // Correct answer
    games[message.guild.id][winner.author.id].wins++;
    userdata[message.guild.id][winner.author.id].credits = (userdata[message.guild.id][winner.author.id].credits || 0) + reward;
    save();

    const winEmbed = tools.brandedEmbed(client, 'success')
      .setTitle(':first_place: إجابة صحيحة!')
      .setDescription(`**${winner.author.username}، تم إضافة ${reward}$ لرصيدك :dollar:**`)
      .setThumbnail(winner.author.displayAvatarURL());
    message.channel.send({ embeds: [winEmbed] });

  } catch (_) {
    // Time's up
    games[message.guild.id][message.author.id].loses++;
    save();

    const loseEmbed = tools.brandedEmbed(client, 'error')
      .setTitle(':stopwatch: انتهى الوقت!')
      .setDescription(`**:ballot_box_with_check: الإجابة الصحيحة هي __${q.ans}__**`);
    message.channel.send({ embeds: [loseEmbed] });
  }
};