'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const globby = require('globby');
const { sync: mkdirp } = require('mkdirp');

const defaultOptions = {
  distFileName: 'en-US.js',
  tokenName: '__i18n',
};

let globalData = {};

function resolveFileSync(filePath, options = {}) {
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(content);
}

function resolveDirSync(options = {}) {
  mkdirp(options.distDir);
  globby
    .sync([ '**/*.*' ], { cwd: options.srcDir })
    .map(filePath => path.resolve(options.srcDir, filePath))
    .map(filePath => resolveFileSync(filePath, options));
}

function outputDataSync(options = {}) {
  const distFile = path.resolve(options.distDir, defaultOptions.distFileName);
  fs.writeFileSync(distFile, `module.exports = ${JSON.stringify(globalData, null, 2)};\n`);
  console.log('\noutput file: %s\n', chalk.cyan(distFile));
}

module.exports = (options = {}) => {
  resolveDirSync(options);
  outputDataSync(options);
};
