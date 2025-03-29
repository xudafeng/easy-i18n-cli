#!/usr/bin/env node

'use strict';

const { EOL } = require('os');
const path = require('path');
const { program } = require('commander');

const { version } = require('../package');

program
  .option('-v, --version')
  .option('--check', 'check locale file')
  .option('-c, --config <string>', 'config file path')
  .parse();

const options = program.opts();

if (options.version) {
  console.info('%s  %s%s', EOL, version, EOL);
  process.exit(0);
}

let config = {};

if (options.config) {
  const configPath = path.resolve(process.cwd(), options.config);
  config = {
    ...config,
    ...require(configPath),
  };
}

const EasyI18n = require('../src/easy-i18n');

if (options.check) {
  return new EasyI18n(config)
    .runWithCheck()
    .catch(console.error);
}

new EasyI18n(config)
  .run()
  .catch(console.error);
