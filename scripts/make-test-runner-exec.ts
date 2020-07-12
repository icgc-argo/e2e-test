const sh = require('shelljs');
const log = require('./logging.ts');

sh.config.fatal = true;

log.info('Make browserstack test runner script executable...');
sh.chmod('u+x', './build/scripts/local.runner.js');
log.success('Complete!');

export {};
