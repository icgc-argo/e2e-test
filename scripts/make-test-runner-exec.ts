const sh = require('shelljs');

sh.config.fatal = true;

sh.chmod('u+x', './build/scripts/local.runner.js');

export {};
