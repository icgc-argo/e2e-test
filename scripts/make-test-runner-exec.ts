import * as sh from 'shelljs';
import log from './logging';

sh.config.fatal = true;

const chmodTestRunner = () => {
  log.info('Make browserstack test runner script executable...');
  sh.chmod('u+x', './build/scripts/local.runner.js');
  log.success('Complete!');
};

export default chmodTestRunner;
