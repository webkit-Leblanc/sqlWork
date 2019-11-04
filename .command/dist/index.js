const {
  basedir, entry, htmls
} = require('../.conf/entry');


const chalk = require('chalk');


if (process.env.IMEXT) {
  console.log(chalk.red(`Environment variable IMEXT=${process.env.IMEXT}\n\n`));
}
const path = require('path');
require('../.conf/webpack')(require('../.conf/config')({
  target: 'dist',
  basedir,
  entry,
  htmls
}));