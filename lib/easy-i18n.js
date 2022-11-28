'use strict';

const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const globby = require('globby');
const { promises: fs } = require('fs');
const { sync: mkdirp } = require('mkdirp');

const defaultOptions = {
  distFileName: 'en-US.js',
  tokenName: '__i18n',
  outputFilter: json => `module.exports = ${JSON.stringify(json, null, 2)};\n`,
  getI18nTokenRegExp: (token) => {
    return new RegExp(`${token}\\(\\s*[\`"']([^\`"']+)[\`"']\\s*[\\),]`, 'g');
  },
  translateFilter: async (value) => {
    return value;
  },
  ignoreKeys: [],
  appendMode: true,
  cwd: process.cwd(),
  debug: false,
};

class EasyI18n {
  constructor(options) {
    this.existedData = {};
    this.currentData = {};
    this.outputData = {};
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  debugLog(...args) {
    if (!this.options.debug) {
      return;
    }
    console.log(...args);
  }

  async output() {
    const { options } = this;
    await this.postResolve();
    fs.writeFile(options.distFile, options.outputFilter(this.outputData));
    console.log('\noutput file: %s\n', chalk.cyan(options.distFile));
  }

  async resolveDir() {
    const { options } = this;
    mkdirp(options.distDir);
    const list = globby
      .sync(options.srcDirs, { cwd: options.cwd })
      .map(filePath => path.resolve(options.cwd, filePath))
      .map(filePath => this.resolveFile(filePath));
    await Promise.all(list);
  }

  sortKey(data) {
    const res = {};
    Object.keys(data).sort().forEach(key => {
      res[key] = data[key];
    });
    return res;
  }

  async postResolve() {
    const { options } = this;
    this.existedData = this.sortKey(this.existedData);
    this.currentData = this.sortKey(this.currentData);
    this.debugLog('existed data:\n%s\n', JSON.stringify(this.existedData, null, 2));
    const removeKeys = _.difference(Object.keys(this.existedData), Object.keys(this.currentData));
    this.debugLog('removed data:\n%s\n', JSON.stringify(removeKeys, null, 2));
    removeKeys.forEach(key => {
      delete this.existedData[key];
    });
    this.debugLog('current data:\n%s\n', JSON.stringify(this.currentData, null, 2));
    const outputData = this.sortKey({
      ...this.currentData,
      ...(options.appendMode ? this.existedData : {}),
    });
    const newKeys = _.difference(Object.keys(this.currentData), Object.keys(this.existedData));
    this.debugLog('new keys:\n%s\n', JSON.stringify(newKeys, null, 2));
    for (let i = 0; i < newKeys.length; i++) {
      const key = newKeys[i];
      outputData[key] = await options.translateFilter(key);
    }
    this.debugLog('output data:\n%s\n', JSON.stringify(outputData, null, 2));
    this.outputData = outputData;
  }

  getI18nTokens(content) {
    const { options } = this;
    const res = {};
    const reg = options.getI18nTokenRegExp(options.tokenName);
    content.replace(reg, (_, _key) => {
      const key = _key.trim();
      if (!options.ignoreKeys.includes(key)) {
        res[key] = key;
      }
    });
    return res;
  }

  async resolveFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const res = this.getI18nTokens(content);
    this.currentData = {
      ...this.currentData,
      ...res,
    };
  }

  async initData() {
    const { distDir, distFileName } = this.options;
    const distFile = path.resolve(distDir, distFileName);
    this.options.distFile = distFile;
    try {
      this.existedData = require(distFile);
    } catch (e) {
      console.error(e);
    }
  }

  async run(options = {}) {
    this.options = {
      ...this.options,
      ...options,
    };
    this.debugLog('options:\n%s\n', JSON.stringify(this.options, null, 2));
    await this.initData();
    await this.resolveDir();
    await this.output();
  }

  hasChinese(str) {
    return /[\u4E00-\u9FA5]+/g.test(str);
  }

  async runWithCheck(options = {}) {
    await this.run(options);

    const checkTarget = require(this.options.distFile);
    const lines = [];
    Object.keys(checkTarget).forEach((key, index) => {
      if (this.hasChinese(checkTarget[key])) {
        lines.push(`index:${index} >>> ${checkTarget[key]}`);
      }
    });
    if (lines.length) {
      const error = new Error('need translate the i18n!');
      error.lines = lines;
      error.linesCount = lines.length;
      throw error;
    }

    console.log('\ni18n translate check passed!\n');
  }
}

EasyI18n.defaultOptions = defaultOptions;

module.exports = EasyI18n;
