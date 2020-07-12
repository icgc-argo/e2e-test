import * as sh from 'shelljs';
import log from './logging';

const buildPath = './build';

sh.config.fatal = true;

const copyTestData = () => {
  log.info('Moving test data to build folder...');
  sh.cp('-R', ['./src/goodtestdata', './src/badtestdata'], `${buildPath}`);
  log.success('Complete!');
};

export default copyTestData;
