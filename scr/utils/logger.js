const log = require('loglevel');
const prefix = require('loglevel-plugin-prefix');

prefix.reg(log);
log.enableAll();
prefix.apply(log);
log.info('The logger is running');

module.exports = log

