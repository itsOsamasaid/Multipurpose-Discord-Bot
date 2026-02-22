const path    = require('path');
const runQuiz = require('./_quizHelper');

exports.run = (client, message, args, tools) => runQuiz(client, message, tools, {
  questionsFile: path.join(__dirname, '../../storage/games/ques.json'),
  title:  ':globe_with_meridians: ما عاصمة هذه الدولة؟',
  footer: 'أمامك 8 ثواني فقط!',
  time:   8000,
});

exports.help = {
  name: 'capitals',
  description: 'Arabic capitals quiz game.',
  usage: 'capitals'
};