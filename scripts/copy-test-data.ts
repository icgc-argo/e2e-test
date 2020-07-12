const sh = require('shelljs');
const log = require('./logging.ts');

const buildPath = './build';

sh.config.fatal = true;

log.info('Moving test data to build folder...');
sh.cp('-R', './src/goodtestdata', './src/badtestdata', `${buildPath}`);
log.success('Complete!');

export {};
