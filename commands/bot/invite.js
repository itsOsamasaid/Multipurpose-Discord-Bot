// Alias for inv
const inv = require('./inv');
exports.run  = inv.run;
exports.help = { ...inv.help, name: 'invite' };