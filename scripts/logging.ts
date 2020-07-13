import chalk from 'chalk';

const info = chalk.magenta.bold;
const success = chalk.green.bold;

const log = {
  info: (msg: string) => console.log(info(msg)),
  success: (msg: string) => console.log(success(msg)),
};

export default log;
