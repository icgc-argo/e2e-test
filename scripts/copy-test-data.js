const sh = require('shelljs');
const chalk = require('chalk');

const info = chalk.magenta.bold;

const buildPath = './build';

sh.config.fatal = true;

console.log(info('Moving test data to build folder...'));
sh.cp('-R', './src/goodtestdata', './src/badtestdata', `${buildPath}`);
console.log(info('Complete!'));
