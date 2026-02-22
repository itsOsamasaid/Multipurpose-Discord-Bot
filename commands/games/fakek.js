const path    = require('path');
const runQuiz = require('./_quizHelper');

exports.run = (client, message, args, tools) => runQuiz(client, message, tools, {
  questionsFile: path.join(__dirname, '../../storage/games/fkk.json'),
  title:  ':jigsaw: فكّك الكلمات الآتية',
  footer: 'أمامك 8 ثواني فقط!',
  time:   8000,
});

exports.help = {
  name: 'fakek',
  description: 'Arabic word unscramble game.',
  usage: 'fakek'
};