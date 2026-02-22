const path     = require('path');
const runQuiz  = require('./_quizHelper');

exports.run = (client, message, args, tools) => runQuiz(client, message, tools, {
  questionsFile: path.join(__dirname, '../../storage/games/amthal.json'),
  title:  ':older_man: أكمل المثل التالي',
  footer: 'أمامك 8 ثواني فقط!',
  time:   8000,
});

exports.help = {
  name: 'amthal',
  description: 'Arabic proverb completion game.',
  usage: 'amthal'
};