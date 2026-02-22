const path    = require('path');
const runQuiz = require('./_quizHelper');

exports.run = (client, message, args, tools) => runQuiz(client, message, tools, {
  questionsFile: path.join(__dirname, '../../storage/games/a3lam.json'),
  title:  ':arrow_heading_down: حدد دولة العلم التالي',
  footer: 'أمامك 10 ثواني فقط!',
  time:   10000,
});

exports.help = {
  name: 'flags',
  description: 'Arabic flag identification game.',
  usage: 'flags'
};