'use strict';

const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const globby = require('globby');
const { promises: fs } = require('fs');
const originFs = require('fs');
const { sync: mkdirp } = require('mkdirp');
const Utils = require('./utils');

const defaultOptions = {
  distFileName: 'en-US.js',
  tokenName: '__i18n',
  outputFilter: json => `module.exports = ${JSON.stringify(json, null, 2)};\n`,
  getI18nTokenRegExp: (token) => {
    return [
      new RegExp(`${token}\\(\\s*[\`"']([^\`"']+)[\`"']\\s*[\\),]`, 'g'),
      new RegExp(`${token}\\(\\s*[\`']([^\`']+)[\`']\\s*[\\),]`, 'g'),
    ];
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
    const { distDir, distFileName } = this.options;
    if (distFileName.endsWith('.ts')) {
      // import ts file as cjs module
      this.registTsNode();
    }
    const distFile = path.resolve(distDir, distFileName);
    this.options.distFile = distFile;
  }

  debugLog(...args) {
    if (!this.options.debug) {
      return;
    }
    console.log(...args);
  }

  infoLog(content, ...args) {
    console.log(`\ntranslate ${chalk.cyan(content)}\n`, ...args);
  }

  registTsNode() {
    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
      },
    });
  }

  async output() {
    const { options } = this;
    await this.postResolve();
    await fs.writeFile(options.distFile, options.outputFilter(this.outputData));
    this.infoLog('output file: %s', options.distFile);
  }

  resolveDirSync() {
    const { options } = this;
    mkdirp(options.distDir);
    return globby
      .sync(options.srcDirs, { cwd: options.cwd })
      .map(filePath => path.resolve(options.cwd, filePath))
      .map(filePath => this.resolveFileSync(filePath));
  }

  sortKey(data) {
    const res = {};
    Object.keys(data).sort().forEach(key => {
      res[key] = data[key];
    });
    return res;
  }

  pickTranslatedData(data) {
    const res = {};
    Object.keys(data).forEach(key => {
      if (!this.hasChinese(data[key])) {
        res[key] = data[key];
      }
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
      // append mode will keep existed translated data
      ...(options.appendMode ? this.pickTranslatedData(this.existedData) : {}),
    });
    const newKeys = _.difference(Object.keys(this.currentData), Object.keys(this.existedData));
    this.debugLog('new keys:\n%s\n', JSON.stringify(newKeys, null, 2));
    for (let i = 0; i < newKeys.length; i++) {
      const key = newKeys[i];
      outputData[key] = await options.translateFilter(this.currentData[key]);
    }
    this.debugLog('output data:\n%s\n', JSON.stringify(outputData, null, 2));
    this.outputData = outputData;
  }

  getI18nTokens(content) {
    const { options } = this;
    const res = {};
    let regList = options.getI18nTokenRegExp(options.tokenName);
    if (!Array.isArray(regList)) {
      regList = [ regList ];
    }
    regList.forEach(reg => {
      content = content.replace(reg, (_, _key) => {
        const key = _key.trim();
        if (!options.ignoreKeys.includes(key)) {
          res[key] = key;
        }
      });
    });
    return res;
  }

  resolveFileSync(filePath) {
    const content = originFs.readFileSync(filePath, 'utf-8');
    const res = this.getI18nTokens(content);

    this.currentData = {
      ...this.currentData,
      ...res,
    };
  }

  initData() {
    const { distFile } = this.options;
    try {
      const data = Utils.noCacheRequire(distFile);
      this.existedData = Utils.extractLocaleFromExport(data);
    } catch (e) {
      console.error(e);
    }
    this.resolveDirSync();
  }

  async run(options = {}) {
    this.options = {
      ...this.options,
      ...options,
    };
    this.debugLog('options:\n%s\n', JSON.stringify(this.options, null, 2));
    this.initData();
    await this.output();
  }

  hasChinese(str) {
    return /[\u4E00-\u9FA5]+/g.test(str);
  }

  async _getLineOffset() {
    const { distFile } = this.options;
    const content = await fs.readFile(distFile, 'utf-8');
    const lines = content.split('\n');
    const offset = lines.findIndex(item => item.includes('module.exports'));
    return offset + 1;
  }

  async check() {
    const { distFile } = this.options;
    let checkTarget = Utils.noCacheRequire(distFile);
    checkTarget = Utils.extractLocaleFromExport(checkTarget);
    const lines = [];
    const lineOffset = await this._getLineOffset();
    Object.keys(checkTarget).forEach((key, index) => {
      if (this.hasChinese(checkTarget[key])) {
        const line = index + lineOffset + 1;
        lines.push(`line:${line} >>> ${checkTarget[key]}`);
      }
    });
    if (lines.length) {
      const error = new Error('need translate the i18n!');
      error.lines = lines;
      error.linesCount = lines.length;
      throw error;
    }

    this.infoLog('i18n translate check passed!');
  }

  async runWithCheck(options = {}) {
    await this.run(options);
    await this.check();
  }
}

EasyI18n.defaultOptions = defaultOptions;

module.exports = EasyI18n;
