'use strict';

module.exports = {
  srcDirs: [
    'test/fixtures/**/*.*',
  ],
  distDir: __dirname,
  distFileName: 'en-US.ts',
  outputFilter: json => `export default ${JSON.stringify(json, null, 2)};\n`,
  tokenName: '__i18n',
  debug: true,
};
