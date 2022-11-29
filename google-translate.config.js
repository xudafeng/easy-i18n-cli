'use strict';

const translate = require('translate-google');

module.exports = {
  srcDirs: [
    'test/fixtures/**/*.*',
  ],
  distDir: __dirname,
  tokenName: '__i18n',
  translateFilter: async value => {
    const text = await translate(value, {
      from: 'en',
      to: 'zh-cn',
    });
    console.log('translate: %s to %s', value, text);
    return text;
  },
  debug: true,
};
