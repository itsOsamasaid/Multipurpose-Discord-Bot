const path    = require('path');
const runQuiz = require('./_quizHelper');

exports.run = (client, message, args, tools) => runQuiz(client, message, tools, {
  questionsFile: path.join(__dirname, '../../storage/games/emoji.json'),
  title:  ':mag_right: ابحث عن الإيموجي القادم!',
  footer: 'أمامك 15 ثانية فقط!',
  time:   15000,
});

exports.help = {
  name: 'emoji',
  description: 'Arabic emoji guessing game.',
  usage: 'emoji'
};